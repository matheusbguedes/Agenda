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
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Scheduling_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Scheduling" ("appointmentDate", "createdAt", "endTime", "id", "resourceUsed", "roomUsed", "startTime", "status", "userId") SELECT "appointmentDate", "createdAt", "endTime", "id", "resourceUsed", "roomUsed", "startTime", "status", "userId" FROM "Scheduling";
DROP TABLE "Scheduling";
ALTER TABLE "new_Scheduling" RENAME TO "Scheduling";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
