-- CreateTable
CREATE TABLE "public"."Destination" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_horizontal" JSONB,
    "image_vertical" JSONB,
    "best_time_to_visit" TEXT NOT NULL,
    "average_cost_per_day_in_eur" DECIMAL NOT NULL,
    "tags" TEXT[],
    "things_to_do" TEXT[],

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "destination_id" INTEGER NOT NULL,
    "rating" INTEGER,
    "positive_comment" TEXT,
    "negative_comment" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "birthday" DATE,
    "googleId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VisitedDestination" (
    "user_id" INTEGER NOT NULL,
    "destination_id" INTEGER NOT NULL,

    CONSTRAINT "VisitedDestination_pkey" PRIMARY KEY ("user_id","destination_id")
);

-- CreateTable
CREATE TABLE "public"."FavoriteDestination" (
    "user_id" INTEGER NOT NULL,
    "destination_id" INTEGER NOT NULL,

    CONSTRAINT "FavoriteDestination_pkey" PRIMARY KEY ("user_id","destination_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "public"."User"("googleId");

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "public"."Destination"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."VisitedDestination" ADD CONSTRAINT "VisitedDestination_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "public"."Destination"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."VisitedDestination" ADD CONSTRAINT "VisitedDestination_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."FavoriteDestination" ADD CONSTRAINT "FavoriteDestination_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "public"."Destination"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."FavoriteDestination" ADD CONSTRAINT "FavoriteDestination_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
