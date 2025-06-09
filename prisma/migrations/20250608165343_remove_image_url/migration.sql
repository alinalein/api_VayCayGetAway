/*
  Warnings:

  - You are about to drop the column `image_url` on the `destinations` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "destinations" DROP COLUMN "image_url",
ADD COLUMN     "image_horizontal" JSONB,
ADD COLUMN     "image_vertical" JSONB;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "comment",
ADD COLUMN     "negative_comment" TEXT,
ADD COLUMN     "positive_comment" TEXT;
