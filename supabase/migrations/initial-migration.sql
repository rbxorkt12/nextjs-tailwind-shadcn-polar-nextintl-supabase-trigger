-- public.benefit_history definition

-- Drop table

-- DROP TABLE public.benefit_history;

CREATE TABLE public.benefit_history (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	user_subscription_id uuid NOT NULL,
	benefit_id uuid NOT NULL,
	event_type text NOT NULL,
	occurred_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
	metadata jsonb NULL,
	CONSTRAINT benefit_history_pkey PRIMARY KEY (id),
	CONSTRAINT benefit_history_user_subscription_id_fkey FOREIGN KEY (user_subscription_id) REFERENCES public.user_subscriptions(id) ON DELETE CASCADE
);

-- public.subscription_history definition

-- Drop table

-- DROP TABLE public.subscription_history;

CREATE TABLE public.subscription_history (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	user_subscription_id uuid NOT NULL,
	event_type text NOT NULL,
	occurred_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
	metadata jsonb NULL,
	CONSTRAINT subscription_history_pkey PRIMARY KEY (id),
	CONSTRAINT subscription_history_user_subscription_id_fkey FOREIGN KEY (user_subscription_id) REFERENCES public.user_subscriptions(id) ON DELETE CASCADE
);


-- public.user_subscriptions definition

-- Drop table

-- DROP TABLE public.user_subscriptions;

CREATE TABLE public.user_subscriptions (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	user_id uuid NOT NULL,
	subscription_id uuid NULL,
	subscription_tier text DEFAULT 'free'::text NOT NULL,
	status text DEFAULT 'active'::text NOT NULL,
	current_period_start timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
	current_period_end timestamptz NULL,
	quota_reset_interval text DEFAULT 'month'::text NOT NULL,
	has_active_benefits bool DEFAULT false NOT NULL,
	created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
	updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
	last_quota_reset_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
	metadata jsonb NULL,
	CONSTRAINT user_subscriptions_pkey PRIMARY KEY (id),
	CONSTRAINT user_subscriptions_user_id_unique UNIQUE (user_id),
	CONSTRAINT user_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- public.webhook_logs definition

-- Drop table

-- DROP TABLE public.webhook_logs;

CREATE TABLE public.webhook_logs (
	id int8 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	event_type varchar(50) NULL,
	user_email text NULL,
	request_payload jsonb NULL,
	response_status int4 NULL,
	response_content text NULL,
	error_message text NULL,
	CONSTRAINT webhook_logs_pkey PRIMARY KEY (id)
);
