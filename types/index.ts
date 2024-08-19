export type Task = {
  id?: number;
  task: string;
  startTime: Date;
  endTime: Date;
  color: string;
}

export type ClockProps = {
  tasks: Task[];
  size: number;
  onDeleteTask : (task: Task) => void;
}