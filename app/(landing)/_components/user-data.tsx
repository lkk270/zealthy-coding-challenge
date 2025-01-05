"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addresses, users } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React from "react";

type UserWithAddress = InferSelectModel<typeof users> & {
  address?: InferSelectModel<typeof addresses>;
};

interface UserDataProps {
  user: UserWithAddress;
  onEdit: () => void;
}

export const UserData = ({ user, onEdit }: UserDataProps) => {
  const aboutMeRef = React.useRef<HTMLParagraphElement>(null);
  const [isScrollable, setIsScrollable] = React.useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = React.useState(false);

  React.useEffect(() => {
    const element = aboutMeRef.current;
    if (element) {
      setIsScrollable(element.scrollHeight > element.clientHeight);

      const handleScroll = () => {
        if (element) {
          const isBottom = Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) < 1;
          setIsScrolledToBottom(isBottom);
        }
      };

      element.addEventListener("scroll", handleScroll);
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, [user.aboutMe]);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Profile Complete!</CardTitle>
        <Button onClick={onEdit}>Edit Profile</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">About Me</h3>
            <div className="relative">
              <p ref={aboutMeRef} className="text-muted-foreground max-h-[150px] overflow-y-auto pr-2">
                {user.aboutMe || "Not provided"}
              </p>
              {isScrollable && !isScrolledToBottom && (
                <div className="absolute bottom-0 left-0 right-2 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Date of Birth</h3>
            <p className="text-muted-foreground">{user.dateOfBirth ? formatDate(user.dateOfBirth) : "Not provided"}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-2">Address</h3>
            {user.address ? (
              <div className="text-muted-foreground">
                <p>{user.address.address1}</p>
                {user.address.address2 && <p>{user.address.address2}</p>}
                <p>
                  {user.address.city}, {user.address.state} {user.address.zip}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">No address provided</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
