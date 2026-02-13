import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users",{
  id          : int('id').autoincrement().primaryKey(),
  name        : varchar('name',{ length : 255}).notNull(),
  userName    : varchar('username' , {length : 255 }).notNull().unique(),
  email       : varchar('email',{ length : 255}).notNull().unique(),
  password    : text('password').notNull(),
  phoneNumber : varchar("phone_number" , { length : 255}),
  role        : mysqlEnum("role" , ["admin" ,"applicant" , "employer" ]).default("applicant"),
  deletedAt   : timestamp("deleted_at"),
  createdAt   : timestamp("created_at").defaultNow().notNull(),
  updatedAt   : timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
})

export const sessions = mysqlTable("sessions" , {
  id        : varchar("id" ,{length : 255}).primaryKey() ,
  userId    : int('user_id').notNull().references(()=> users.id , {onDelete : 'cascade'}),
  userAgent : text('user_agent').notNull(),
  ipAddress : varchar('ip_address',{length : 255}).notNull(),
  expiresAt : timestamp('expires_at') ,
  createdAt : timestamp("created_at").defaultNow().notNull() ,
  updatedAt : timestamp("updated_at").defaultNow().onUpdateNow().notNull() ,
})  

 