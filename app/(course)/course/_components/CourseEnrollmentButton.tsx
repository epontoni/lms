"use client";

// Client
import { initMercadoPago } from "@mercadopago/sdk-react";
initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!, {
  locale: "es-AR",
});

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

import axios from "axios";
import { checkout } from "@/lib/actions/purchase.actionts";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface CourseEnrollmentButtonProps {
  courseId: string;
  price: number;
}

interface OrderDataProps {
  quantity: string;
  price: string;
  amount: number;
  description: string;
}

export default function CourseEnrollmentButton({
  courseId,
  price,
}: CourseEnrollmentButtonProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      console.log("cheking out...");
      const response = await axios.post(`/api/courses/${courseId}/checkout`);
      setIsLoading(false);
      window.location.assign(response.data.init_point); // Avoid cors
    } catch (error) {
      console.log("Error al realizar checkout", error);
    }
  };
  return (
    <Button
      disabled={isLoading}
      size="sm"
      className="w-full md:w-auto"
      onClick={handleClick}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isLoading && (
        <span>Enroll for {price === 0 ? "Free" : formatPrice(price)}</span>
      )}
    </Button>
  );
}
