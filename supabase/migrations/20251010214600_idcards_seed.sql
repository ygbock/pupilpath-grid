-- Seed default Student and Staff ID Card templates based on a simple design schema
begin;

insert into public.id_card_templates(name, target_type, design)
values
  (
    'Standard Student Card',
    'student',
    jsonb_build_object(
      'size', jsonb_build_object('width', 1017, 'height', 639),
      'theme', jsonb_build_object('primary', '#0E5BC2', 'accent', '#152F5F', 'text', '#0F172A', 'muted', '#475569'),
      'sides', jsonb_build_object(
        'front', jsonb_build_array(
          -- header bar
          jsonb_build_object('type','rect','x',0,'y',0,'w',1017,'h',120,'fill','#0E5BC2'),
          -- logo box
          jsonb_build_object('type','image','key','logo_url','x',24,'y',20,'w',80,'h',80,'fit','contain','placeholder','LOGO'),
          -- school name
          jsonb_build_object('type','text','text','ABC SCHOOL NAME','x',120,'y',28,'w',700,'h',40,'color','#FFFFFF','size',28,'weight',700),
          jsonb_build_object('type','text','text','SLOGAN HERE','x',120,'y',68,'w',700,'h',30,'color','#E2E8F0','size',16,'weight',500),
          -- photo frame
          jsonb_build_object('type','image','key','photo_url','x',24,'y',160,'w',200,'h',240,'fit','cover','placeholder','PHOTO'),
          -- labels and fields (left column)
          jsonb_build_object('type','text','text','Reg No','x',248,'y',160,'w',140,'h',24,'color','#64748B','size',14),
          jsonb_build_object('type','field','field','reg_no','x',400,'y',160,'w',350,'h',24,'color','#0F172A','size',14,'weight',600),
          jsonb_build_object('type','text','text','Student ID','x',248,'y',196,'w',140,'h',24,'color','#64748B','size',14),
          jsonb_build_object('type','field','field','student_id','x',400,'y',196,'w',350,'h',24,'color','#0F172A','size',14,'weight',600),
          jsonb_build_object('type','text','text','Student Name','x',248,'y',232,'w',140,'h',24,'color','#64748B','size',14),
          jsonb_build_object('type','field','field','student_name','x',400,'y',232,'w',500,'h',24,'color','#0F172A','size',16,'weight',700),
          jsonb_build_object('type','text','text','Father/Guardian','x',248,'y',268,'w',140,'h',24,'color','#64748B','size',14),
          jsonb_build_object('type','field','field','guardian_name','x',400,'y',268,'w',500,'h',24,'color','#0F172A','size',14,'weight',600),
          jsonb_build_object('type','text','text','Class','x',248,'y',304,'w',140,'h',24,'color','#64748B','size',14),
          jsonb_build_object('type','field','field','class','x',400,'y',304,'w',300,'h',24,'color','#0F172A','size',14,'weight',600),
          jsonb_build_object('type','text','text','Emergency','x',248,'y',340,'w',140,'h',24,'color','#64748B','size',14),
          jsonb_build_object('type','field','field','emergency_phone','x',400,'y',340,'w',300,'h',24,'color','#0F172A','size',14,'weight',600),
          -- footer
          jsonb_build_object('type','text','text','School address, Street, State, 1234 • Telephone: 123-456-7890','x',24,'y',590,'w',970,'h',30,'color','#1E293B','size',14,'align','center')
        ),
        'back', jsonb_build_array(
          jsonb_build_object('type','rect','x',0,'y',0,'w',1017,'h',120,'fill','#152F5F'),
          jsonb_build_object('type','text','text','TERMS AND CONDITIONS','x',24,'y',28,'w',900,'h',40,'color','#FFFFFF','size',22,'weight',700),
          jsonb_build_object('type','text','text','• This card is property of the school.\n• If found please return to address below.\n• Card must be presented on request.','x',24,'y',150,'w',970,'h',180,'color','#334155','size',16),
          jsonb_build_object('type','text','text','Phone: {{phone}}  •  Email: {{email}}  •  Website: {{website}}','x',24,'y',420,'w',970,'h',30,'color','#0F172A','size',16,'align','center'),
          jsonb_build_object('type','qr','key','qr_payload','x',880,'y',460,'w',100,'h',100),
          jsonb_build_object('type','text','text','Principal','x',800,'y',580,'w',180,'h',30,'color','#475569','size',14,'align','right')
        )
      )
    )
  ),
  (
    'Standard Staff Card',
    'staff',
    jsonb_build_object(
      'size', jsonb_build_object('width', 1017, 'height', 639),
      'theme', jsonb_build_object('primary', '#1F2937', 'accent', '#111827', 'text', '#0F172A', 'muted', '#6B7280'),
      'sides', jsonb_build_object(
        'front', jsonb_build_array(
          jsonb_build_object('type','rect','x',0,'y',0,'w',1017,'h',120,'fill','#1F2937'),
          jsonb_build_object('type','image','key','logo_url','x',24,'y',20,'w',80,'h',80,'fit','contain','placeholder','LOGO'),
          jsonb_build_object('type','text','text','ABC SCHOOL NAME','x',120,'y',28,'w',700,'h',40,'color','#FFFFFF','size',28,'weight',700),
          jsonb_build_object('type','text','text','STAFF IDENTITY CARD','x',120,'y',68,'w',700,'h',30,'color','#E2E8F0','size',16,'weight',500),
          jsonb_build_object('type','image','key','photo_url','x',24,'y',160,'w',200,'h',240,'fit','cover','placeholder','PHOTO'),
          jsonb_build_object('type','text','text','Employee ID','x',248,'y',160,'w',160,'h',24,'color','#6B7280','size',14),
          jsonb_build_object('type','field','field','employee_id','x',420,'y',160,'w',350,'h',24,'color','#0F172A','size',14,'weight',600),
          jsonb_build_object('type','text','text','Name','x',248,'y',196,'w',160,'h',24,'color','#6B7280','size',14),
          jsonb_build_object('type','field','field','staff_name','x',420,'y',196,'w',500,'h',24,'color','#0F172A','size',16,'weight',700),
          jsonb_build_object('type','text','text','Department','x',248,'y',232,'w',160,'h',24,'color','#6B7280','size',14),
          jsonb_build_object('type','field','field','department','x',420,'y',232,'w',400,'h',24,'color','#0F172A','size',14,'weight',600),
          jsonb_build_object('type','text','text','Designation','x',248,'y',268,'w',160,'h',24,'color','#6B7280','size',14),
          jsonb_build_object('type','field','field','designation','x',420,'y',268,'w',400,'h',24,'color','#0F172A','size',14,'weight',600),
          jsonb_build_object('type','text','text','Phone','x',248,'y',304,'w',160,'h',24,'color','#6B7280','size',14),
          jsonb_build_object('type','field','field','phone','x',420,'y',304,'w',300,'h',24,'color','#0F172A','size',14,'weight',600),
          jsonb_build_object('type','text','text','Email','x',248,'y',340,'w',160,'h',24,'color','#6B7280','size',14),
          jsonb_build_object('type','field','field','email','x',420,'y',340,'w',400,'h',24,'color','#0F172A','size',14,'weight',600)
        ),
        'back', jsonb_build_array(
          jsonb_build_object('type','rect','x',0,'y',0,'w',1017,'h',120,'fill','#111827'),
          jsonb_build_object('type','text','text','TERMS AND CONDITIONS','x',24,'y',28,'w',900,'h',40,'color','#FFFFFF','size',22,'weight',700),
          jsonb_build_object('type','text','text','• This card is property of the school.\n• If found please return to address below.\n• Card must be presented on request.','x',24,'y',150,'w',970,'h',180,'color','#4B5563','size',16),
          jsonb_build_object('type','text','text','Phone: {{phone}}  •  Email: {{email}}  •  Website: {{website}}','x',24,'y',420,'w',970,'h',30,'color','#0F172A','size',16,'align','center'),
          jsonb_build_object('type','qr','key','qr_payload','x',880,'y',460,'w',100,'h',100),
          jsonb_build_object('type','text','text','Principal','x',800,'y',580,'w',180,'h',30,'color','#6B7280','size',14,'align','right')
        )
      )
    )
  )
on conflict do nothing;

commit;
