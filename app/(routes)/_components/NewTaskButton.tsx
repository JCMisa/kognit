import { ClayButton } from "@/components/ui-lora/Clay";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

const NewTaskButton = () => {
  return (
    <div className="flex items-center gap-4">
      <Link href="/tasks/create">
        <ClayButton
          variant="primary"
          className="flex items-center gap-2 px-8 py-4 shadow-xl shadow-primary/20  text-center"
        >
          <PlusIcon className="w-5 h-5 stroke-[3px]" />
          <span className="font-bold">New Task</span>
        </ClayButton>
      </Link>
    </div>
  );
};

export default NewTaskButton;
