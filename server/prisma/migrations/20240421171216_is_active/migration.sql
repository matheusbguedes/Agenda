/*
  Warnings:

  - You are about to drop the column `status` on the `Scheduling` table. All the data in the column will be lost.
  - Added the required column `isActive` to the `Scheduling` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Scheduling" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "appointmentDate" DATETIME NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "resourceUsed" TEXT,
    "roomUsed" TEXT,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Scheduling_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Scheduling" ("appointmentDate", "createdAt", "endTime", "id", "resourceUsed", "roomUsed", "startTime", "userId") SELECT "appointmentDate", "createdAt", "endTime", "id", "resourceUsed", "roomUsed", "startTime", "userId" FROM "Scheduling";
DROP TABLE "Scheduling";
ALTER TABLE "new_Scheduling" RENAME TO "Scheduling";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
