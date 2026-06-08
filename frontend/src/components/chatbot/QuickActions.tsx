import { motion } from 'framer-motion';

interface QuickAction {
  label: string;
  value: string;
}

interface Props {
  actions: QuickAction[];
  onSelect: (value: string) => void;
}

export default function QuickActions({ actions, onSelect }: Props) {
  return (
    <div className="px-3 pb-2 flex flex-col gap-2 shrink-0">
      <p className="text-xs text-muted-foreground text-center">Quick actions</p>
      <div className="flex flex-col gap-1.5">
        {actions.map((action, i) => (
          <motion.button
            key={action.value}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => onSelect(action.value)}
            className="w-full text-left text-sm px-3 py-2 rounded-xl border border-border bg-background hover:bg-secondary/10 hover:border-secondary/50 transition-all duration-150 font-medium text-foreground"
          >
            {action.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
