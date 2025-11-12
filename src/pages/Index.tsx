// Landing page

import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-medical-light to-background">
      <div className="text-center px-4">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center">
            <Activity className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>
        <h1 className="mb-4 text-5xl font-bold">MediCare</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
          Your trusted healthcare appointment booking platform. Connect with the best doctors.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/login">
            <Button size="lg">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button size="lg" variant="outline">Register</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
