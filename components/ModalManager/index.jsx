"use client";
import { useSelector } from "react-redux";
import MultiStepCreator from "@/components/User/MultiStepCreator";
import PromotionPopup from "@/components/User/PromotionPopup";

export default function ModalManager() {
  const { multiStepCreator, promotionPopup } = useSelector((state) => state.cta);

  return (
    <>
      <MultiStepCreator />
      <PromotionPopup />
    </>
  );
} 