-- ENUMS
CREATE TYPE public.service_category AS ENUM ('fotoin','videoin','sutradarain','editin','desain_in','tigadi_in','musik_in','voice_in','lainnya');
CREATE TYPE public.job_type AS ENUM ('onsite','remote');
CREATE TYPE public.job_status AS ENUM ('posted','accepted','in_progress','completed','paid','cancelled');
CREATE TYPE public.application_status AS ENUM ('pending','accepted','declined');
CREATE TYPE public.notification_type AS ENUM ('new_applicant','application_status','new_message','payment_confirmed','review_received');

-- JOBS
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category public.service_category NOT NULL,
  type public.job_type NOT NULL,
  status public.job_status NOT NULL DEFAULT 'posted',
  scheduled_at timestamptz,
  location_address text,
  location_lat numeric,
  location_lng numeric,
  budget_idr integer,
  accepted_freelancer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  paused boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs viewable by everyone" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Client can create own jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Client can update own jobs" ON public.jobs FOR UPDATE USING (auth.uid() = client_id);
CREATE POLICY "Client can delete own jobs" ON public.jobs FOR DELETE USING (auth.uid() = client_id);

CREATE INDEX idx_jobs_client ON public.jobs(client_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_category ON public.jobs(category);

-- APPLICATIONS
CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  freelancer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text,
  status public.application_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, freelancer_id)
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Client (job owner) sees applications for their jobs; freelancer sees own
CREATE POLICY "Client sees apps on own jobs" ON public.job_applications FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = job_id AND j.client_id = auth.uid())
  OR auth.uid() = freelancer_id
);
CREATE POLICY "Freelancer creates own apps" ON public.job_applications FOR INSERT
WITH CHECK (auth.uid() = freelancer_id);
CREATE POLICY "Client updates apps on own jobs" ON public.job_applications FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = job_id AND j.client_id = auth.uid()));
CREATE POLICY "Freelancer deletes own apps" ON public.job_applications FOR DELETE
USING (auth.uid() = freelancer_id);

CREATE INDEX idx_apps_job ON public.job_applications(job_id);
CREATE INDEX idx_apps_freelancer ON public.job_applications(freelancer_id);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.notification_type NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User sees own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User updates own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Anyone authenticated can insert notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "User deletes own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_notif_user ON public.notifications(user_id, read, created_at DESC);

-- REVIEWS
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  freelancer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, client_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Client creates review on own job" ON public.reviews FOR INSERT
WITH CHECK (
  auth.uid() = client_id
  AND EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = job_id AND j.client_id = auth.uid() AND j.status IN ('completed','paid'))
);

CREATE INDEX idx_reviews_freelancer ON public.reviews(freelancer_id);

-- TRIGGERS for updated_at
CREATE TRIGGER trg_jobs_updated_at BEFORE UPDATE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_apps_updated_at BEFORE UPDATE ON public.job_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- TRIGGER: when freelancer applies, notify the client
CREATE OR REPLACE FUNCTION public.notify_client_on_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_client_id uuid;
  v_job_title text;
  v_freelancer_name text;
BEGIN
  SELECT client_id, title INTO v_client_id, v_job_title FROM public.jobs WHERE id = NEW.job_id;
  SELECT COALESCE(full_name, 'Seorang freelancer') INTO v_freelancer_name FROM public.profiles WHERE id = NEW.freelancer_id;

  INSERT INTO public.notifications (user_id, type, title, body, link)
  VALUES (
    v_client_id,
    'new_applicant',
    'Lamaran baru',
    v_freelancer_name || ' melamar pekerjaan "' || v_job_title || '"',
    '/client/bookings/' || NEW.job_id
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_client_on_application
AFTER INSERT ON public.job_applications
FOR EACH ROW EXECUTE FUNCTION public.notify_client_on_application();

-- TRIGGER: when application status changes, notify freelancer
CREATE OR REPLACE FUNCTION public.notify_freelancer_on_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_job_title text;
BEGIN
  IF NEW.status = OLD.status THEN
    RETURN NEW;
  END IF;

  SELECT title INTO v_job_title FROM public.jobs WHERE id = NEW.job_id;

  INSERT INTO public.notifications (user_id, type, title, body, link)
  VALUES (
    NEW.freelancer_id,
    'application_status',
    CASE NEW.status
      WHEN 'accepted' THEN 'Lamaran diterima'
      WHEN 'declined' THEN 'Lamaran ditolak'
      ELSE 'Status lamaran diperbarui'
    END,
    'Pekerjaan "' || v_job_title || '" — status: ' || NEW.status::text,
    '/freelancer/applications'
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_freelancer_on_status
AFTER UPDATE ON public.job_applications
FOR EACH ROW EXECUTE FUNCTION public.notify_freelancer_on_status();