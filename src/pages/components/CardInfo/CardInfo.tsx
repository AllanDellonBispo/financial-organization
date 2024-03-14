import { Card } from "@chakra-ui/react";
import { CardControl } from "./CardControl";
import { CardValues } from "./CardValues";

type Props = {
    month: string | undefined;
    activeFilter: ()=> void;
    activeButton: boolean;
    bg: string;
    receiptTotal: number;
    expensesTotal: number;
    expensesPartial: number;
    previousMonth: () => Promise<void | undefined>;
    nextMonth: ()=> Promise<void | undefined>;
    onOpenSearch: ()=> Promise<void | undefined>;
}

export const CardInfo = ({ month, activeFilter, activeButton, bg, receiptTotal, expensesTotal, expensesPartial, previousMonth, nextMonth, onOpenSearch}: Props) => {
    return(
        <Card display={'flex'} direction={'row'} w={'1000px'} mb={4} alignItems={'center'}>
          <CardControl month={month} nextMonth={async ()=>  await nextMonth()} previousMonth={async () => await previousMonth()} onOpenSearch={async ()=> await onOpenSearch()} activeFilter={()=>activeFilter()} bg={bg} activeButton={activeButton} />
          <CardValues receiptTotal={receiptTotal} expensesTotal={expensesTotal} expensesPartial={expensesPartial} />
      </Card>
    );
}