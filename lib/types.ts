export type ChildProfile = {
  id: string;
  name: string;
  age_years: number | null;
  date_of_birth: string | null;
  notes: string | null;
  flags: string[] | null;
  created_at: string;
};

export type Conversation = {
  id: string;
  child_profile_id: string | null;
  title: string | null;
  behavior_tags: string[] | null;
  is_saved: boolean;
  message_count: number;
  created_at: string;
  child_profiles?: Pick<ChildProfile, "id" | "name" | "age_years"> | null;
};

export type Message = {
  id: string;
  conversation_id: string;
  role: "parent" | "coach";
  content: string;
  vika_validate: string | null;
  vika_investigate: string | null;
  vika_know: string | null;
  vika_act: string | null;
  vika_confidence: number | null;
  vika_review_status: string | null;
  suggested_followups: string[] | null;
  created_at: string;
};

export type VikaResponse = {
  validate: string;
  investigate: string;
  know: string;
  act: string;
  suggested_followups: string[];
  behavior_tags: string[];
  title: string;
  confidence: number;
};
