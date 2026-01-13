import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { LoaderCircle } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] text-sm font-medium transition-all duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // shinny: "bg-gradient-to-b from-primary to-[#ffa175] from-[70%] hover:bg-primary/95 text-[white]/90 rounded-[10px] border-[3px] border-[#ff915d] shadow-lg active:translate-y-[2px]",
        shinny: "bg-primary text-[white]/90 rounded-[10px] relative overflow-hidden active:translate-y-[2px]",
        default:
          "bg-foreground text-background shadow-xs hover:bg-foreground/80 relative  overflow-hidden ",
        destructive:
          "bg-gradient-to-b from-destructive/50 to-destructive to-[60%] dark:from-destructive dark:to-destructive/60 dark:to-[100%] dark:from-[50%] text-white shadow-xs focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size,
  asChild = false,
  loading = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  const buttonContent = (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={loading || props.disabled}
      {...props}
    >
      {variant == "shinny" && <div className="absolute h-[35%] w-full rounded-[50%] bg-white left-0 top-[-15%] blur-[15px] z-[2]" />}
      {variant == "default" && <div className="absolute dark:h-[22%] h-[18%] w-full rounded-[50%] bg-background left-0 top-[-14%] z-[2] blur-[10px] dark:blur-[10px] dark:bottom-[-27%] dark:top-auto" />}
      {loading ? <LoaderCircle className="animate-spin" /> : children}
    </Comp>
  )

  return buttonContent

}

export { Button, buttonVariants }
