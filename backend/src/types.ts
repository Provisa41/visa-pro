export type ChecklistItemStatus = 'ready' | 'needed' | 'none';

export interface ChecklistItemTemplate {
  id: string;
  title: string;
  instruction: string;
  required: boolean;
}

export interface ChecklistItemProgress extends ChecklistItemTemplate {
  status: ChecklistItemStatus;
}
