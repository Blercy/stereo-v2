CREATE TABLE public.settings {
  id TEXT PRIMARY NOT NULL,
  "data" TEXT NULL
}

CREATE TABLE public.user (
	id text PRIMARY NOT NULL,
	commands int default 0,
  songs int default 0
  playlists json[]
);
