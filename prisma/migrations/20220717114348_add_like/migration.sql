-- CreateTable
CREATE TABLE "Like" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likeUserId" INTEGER NOT NULL,
    CONSTRAINT "Like_likeUserId_fkey" FOREIGN KEY ("likeUserId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
