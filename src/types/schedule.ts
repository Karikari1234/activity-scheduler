/**
 * Schedule Types for Activity Scheduler
 */

export interface TimeRange {
  start: string; // "HH:MM" format
  end: string;   // "HH:MM" format
}

/**
 * Rich Text Content Types for Tiptap
 */
export interface TextNode {
  type: 'text';
  text: string;
  marks?: Array<{
    type: string;
    attrs?: Record<string, unknown>;
  }>;
}

export interface ParagraphNode {
  type: 'paragraph';
  content?: Array<TextNode>;
}

export interface BulletListNode {
  type: 'bulletList';
  content: Array<ListItemNode>;
}

export interface OrderedListNode {
  type: 'orderedList';
  content: Array<ListItemNode>;
}

export interface ListItemNode {
  type: 'listItem';
  content: Array<ParagraphNode>;
}

export interface RichTextContent {
  type: 'doc';
  content: Array<ParagraphNode | BulletListNode | OrderedListNode>;
}

/**
 * Main Schedule interface representing a row in the schedules table
 */
export interface Schedule {
  id: string;
  user_id: string;
  schedule_date: string; // ISO format date string YYYY-MM-DD
  time_range: TimeRange;
  place: RichTextContent | null;
  activity: RichTextContent | null;
  comment_link: string | null;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

/**
 * Type for creating a new schedule (omitting auto-generated fields)
 */
export type NewSchedule = Omit<Schedule, 'id' | 'created_at' | 'updated_at'>;

/**
 * Type for updating an existing schedule (making most fields optional except id)
 */
export type UpdateSchedule = Partial<Omit<Schedule, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

/**
 * Type for query parameters when fetching schedules
 */
export interface ScheduleQueryParams {
  startDate?: string; // ISO format date YYYY-MM-DD
  endDate?: string;   // ISO format date YYYY-MM-DD
  limit?: number;
  offset?: number;
}
