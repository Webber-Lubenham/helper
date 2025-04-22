-- Seed para tabela de instituições
INSERT INTO public.institutions (name, document, email_domain, address, phone)
VALUES 
  ('Colégio Exemplo', '12345678901234', 'exemplo.edu.br', 'Rua da Educação, 123', '+55 11 98765-4321'),
  ('Escola Modelo', '98765432109876', 'modelo.edu.br', 'Avenida do Ensino, 456', '+55 11 91234-5678');

-- Seed para tabela de estudantes
INSERT INTO public.students (institution_id, class, enrollment_number, birth_date)
VALUES 
  ((SELECT id FROM public.institutions WHERE name = 'Colégio Exemplo'), '9A', '2024001', '2010-03-15'),
  ((SELECT id FROM public.institutions WHERE name = 'Colégio Exemplo'), '9B', '2024002', '2010-05-20');

-- Seed para tabela de responsáveis
INSERT INTO public.guardians (document_type, document_number, phone)
VALUES 
  ('CPF', '12345678901', '+55 11 98888-7777'),
  ('CPF', '98765432109', '+55 11 97777-8888');

-- Seed para tabela de relacionamentos entre responsáveis e estudantes
INSERT INTO public.guardian_students (guardian_id, student_id, relationship, is_primary)
VALUES 
  ((SELECT id FROM public.guardians WHERE document_number = '12345678901'),
   (SELECT id FROM public.students WHERE enrollment_number = '2024001'),
   'parent', true),
  ((SELECT id FROM public.guardians WHERE document_number = '98765432109'),
   (SELECT id FROM public.students WHERE enrollment_number = '2024002'),
   'parent', true);