interface Schedule {
  id: string;
  userId: string;
  userName: string;
  title: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  resourceUsed?: string;
  roomUsed?: string;
  createdAt: Date;
}
