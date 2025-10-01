import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StudentIdCardProps {
  id: string;
  name: string;
  admissionNo: string;
  className?: string;
  section?: string;
  rollNo?: string;
  guardian?: string;
  phone?: string;
  avatar?: string;
}

export function StudentIdCard({ id, name, admissionNo, className, section, rollNo, guardian, phone, avatar }: StudentIdCardProps) {
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
          <div className="text-sm text-muted-foreground">Admission No: {admissionNo}</div>
        </div>
      </div>

      <div className="grid gap-2 text-sm">
        <div><strong>Class:</strong> {className} {section ? `- ${section}` : ''}</div>
        <div><strong>Roll No:</strong> {rollNo}</div>
        <div><strong>Guardian:</strong> {guardian}</div>
        <div><strong>Phone:</strong> {phone}</div>
        <div><strong>ID:</strong> {id}</div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={handlePrint}>Print</Button>
      </div>
    </div>
  );
}
