import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TeacherIdCardProps {
  id: number;
  name: string;
  employeeId?: string;
  email?: string;
  phone?: string;
  subject?: string;
  avatar?: string;
}

export function TeacherIdCard({ id, name, employeeId, email, phone, subject, avatar }: TeacherIdCardProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md text-foreground print:bg-white print:shadow-none">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="w-16 h-16">
          {avatar ? <AvatarImage src={avatar} /> : <AvatarFallback className="bg-primary/10 text-primary">{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>}
        </Avatar>
        <div>
          <div className="text-lg font-semibold">{name}</div>
          <div className="text-sm text-muted-foreground">Employee ID: {employeeId ?? id}</div>
        </div>
      </div>

      <div className="grid gap-2 text-sm">
        <div><strong>Subject:</strong> {subject}</div>
        <div><strong>Email:</strong> {email}</div>
        <div><strong>Phone:</strong> {phone}</div>
        <div><strong>ID:</strong> {id}</div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={handlePrint}>Print</Button>
      </div>
    </div>
  );
}
