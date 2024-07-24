/*
  Warnings:

  - You are about to drop the column `isActive` on the `Scheduling` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Scheduling" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "appointmentDate" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "resourceUsed" TEXT,
    "roomUsed" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Scheduling_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Scheduling" ("appointmentDate", "createdAt", "endTime", "id", "resourceUsed", "roomUsed", "startTime", "title", "userId") SELECT "appointmentDate", "createdAt", "endTime", "id", "resourceUsed", "roomUsed", "startTime", "title", "userId" FROM "Scheduling";
DROP TABLE "Scheduling";
ALTER TABLE "new_Scheduling" RENAME TO "Scheduling";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
