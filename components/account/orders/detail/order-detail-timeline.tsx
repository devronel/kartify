import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OrderDetailTimeline() {
  return (
    <section aria-labelledby="order-timeline-heading">
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 id="order-timeline-heading">Timeline</h2>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ol>
            <li className="group flex gap-3 pb-6 last:pb-0">
              <div className="relative flex w-2.5 shrink-0 justify-center">
                <span
                  className="mt-1.5 size-2.5 rounded-full bg-primary ring-4 ring-card"
                  aria-hidden="true"
                />
                <span
                  className="absolute top-4 bottom-0 w-px bg-border group-last:hidden"
                  aria-hidden="true"
                />
              </div>

              <div className="-mt-0.5">
                <p className="text-sm font-medium">Order placed</p>
                {/* TODO(logic): format date and time */}
                <p className="text-xs text-muted-foreground">
                  <time dateTime="2026-10-25T10:42">Oct 25, 2026, 10:42 AM</time>
                </p>
              </div>
            </li>

            <li className="group flex gap-3 pb-6 last:pb-0">
              <div className="relative flex w-2.5 shrink-0 justify-center">
                <span
                  className="mt-1.5 size-2.5 rounded-full bg-primary ring-4 ring-card"
                  aria-hidden="true"
                />
                <span
                  className="absolute top-4 bottom-0 w-px bg-border group-last:hidden"
                  aria-hidden="true"
                />
              </div>

              <div className="-mt-0.5">
                <p className="text-sm font-medium">Payment received</p>
                {/* TODO(logic): format date and time */}
                <p className="text-xs text-muted-foreground">
                  <time dateTime="2026-10-25T10:48">Oct 25, 2026, 10:48 AM</time>
                </p>
              </div>
            </li>

            <li className="group flex gap-3 pb-6 last:pb-0">
              <div className="relative flex w-2.5 shrink-0 justify-center">
                <span
                  className="mt-1.5 size-2.5 rounded-full bg-primary ring-4 ring-card"
                  aria-hidden="true"
                />
                <span
                  className="absolute top-4 bottom-0 w-px bg-border group-last:hidden"
                  aria-hidden="true"
                />
              </div>

              <div className="-mt-0.5">
                <p className="text-sm font-medium">Preparing</p>
                {/* TODO(logic): format date and time */}
                <p className="text-xs text-muted-foreground">
                  <time dateTime="2026-10-25T14:15">Oct 25, 2026, 2:15 PM</time>
                </p>
              </div>
            </li>

            <li className="group flex gap-3 pb-6 last:pb-0">
              <div className="relative flex w-2.5 shrink-0 justify-center">
                <span
                  className="mt-1.5 size-2.5 rounded-full bg-primary ring-4 ring-card"
                  aria-hidden="true"
                />
                <span
                  className="absolute top-4 bottom-0 w-px bg-border group-last:hidden"
                  aria-hidden="true"
                />
              </div>

              <div className="-mt-0.5">
                <p className="text-sm font-medium">Shipped</p>
                {/* TODO(logic): format date and time */}
                <p className="text-xs text-muted-foreground">
                  <time dateTime="2026-10-26T09:30">Oct 26, 2026, 9:30 AM</time>
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </section>
  )
}
