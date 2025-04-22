import { pgTable, serial, text, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';

// Tabla de instituciones
export const institutions = pgTable('institutions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  document: varchar('document', { length: 14 }).notNull(),
  emailDomain: text('email_domain').notNull(),
  address: text('address'),
  phone: varchar('phone', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Tabla de estudiantes
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  institutionId: serial('institution_id').references(() => institutions.id),
  class: text('class').notNull(),
  enrollmentNumber: text('enrollment_number').notNull(),
  birthDate: timestamp('birth_date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Tabla de responsables
export const guardians = pgTable('guardians', {
  id: serial('id').primaryKey(),
  documentType: text('document_type').notNull(),
  documentNumber: varchar('document_number', { length: 14 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Tabla de relaciones entre responsables y estudiantes
export const guardianStudents = pgTable('guardian_students', {
  guardianId: serial('guardian_id').references(() => guardians.id),
  studentId: serial('student_id').references(() => students.id),
  relationship: text('relationship').notNull(),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});