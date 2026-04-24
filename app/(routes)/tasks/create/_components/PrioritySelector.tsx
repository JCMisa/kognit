import { motion } from "framer-motion";
import { ArrowDown, Minus, ArrowUp } from "lucide-react";

const priorities = [
  {
    value: "low",
    label: "Low",
    icon: ArrowDown,
    color: "text-emerald-600 dark:text-emerald-400",
    activeBg: "bg-emerald-50 dark:bg-emerald-900/30",
    activeBorder: "border-emerald-200 dark:border-emerald-800",
  },
  {
    value: "medium",
    label: "Medium",
    icon: Minus,
    color: "text-amber-600 dark:text-amber-400",
    activeBg: "bg-amber-50 dark:bg-amber-900/30",
    activeBorder: "border-amber-200 dark:border-amber-800",
  },
  {
    value: "high",
    label: "High",
    icon: ArrowUp,
    color: "text-red-600 dark:text-red-400",
    activeBg: "bg-red-50 dark:bg-red-900/30",
    activeBorder: "border-red-200 dark:border-red-800",
  },
];

export default function PrioritySelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex gap-3">
      {priorities.map((p) => {
        const Icon = p.icon;
        const isActive = value === p.value;
        return (
          <motion.button
            key={p.value}
            type="button"
            whileTap={{ scale: 0.93 }}
            onClick={() => onChange(p.value)}
            className={`
              clay-pill flex items-center gap-2 px-4 py-2.5 text-sm font-medium
              transition-all duration-200
              ${
                isActive
                  ? `${p.activeBg} ${p.activeBorder} border ${p.color} active`
                  : "text-muted-foreground hover:text-foreground"
              }
            `}
          >
            <Icon className={`w-4 h-4 ${isActive ? p.color : ""}`} />
            <span>{p.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
