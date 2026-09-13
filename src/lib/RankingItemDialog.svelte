<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import DialogTable from "$lib/DialogTable.svelte";
  import type { RankedCompany } from "$lib/types.js";

  let { stock, ranking }: { stock: RankedCompany; ranking: number } = $props();
</script>

<Dialog.Root>
  <Dialog.Trigger type="button" class={buttonVariants({ variant: "outline" })}>
    Details
  </Dialog.Trigger>
  <Dialog.Content
    class="max-h-[90vh] overflow-y-auto p-6 sm:max-w-[900px] md:p-8"
  >
    <Dialog.Header>
      <Dialog.Title class="pr-10 text-3xl">{stock.companyName}</Dialog.Title>
      <Dialog.Description class="text-base">
        Rank #{ranking} · Net impact {stock.esg.net_impact_ratio ||
          "not available"}
      </Dialog.Description>
    </Dialog.Header>
    <DialogTable {stock} />
  </Dialog.Content>
</Dialog.Root>
