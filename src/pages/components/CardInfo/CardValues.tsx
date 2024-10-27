import { CardBody, Flex, Stat, StatArrow, Text } from "@chakra-ui/react";

type Props = {
    receiptTotal: number;
    expensesTotal: number;
    expensesPartial: number;
}

export const CardValues = ({receiptTotal, expensesTotal, expensesPartial}: Props) => {
    return(
        <>
            <CardBody>
                <Text>Receita</Text>
                <Text  fontWeight={'bold'}>R$ {Number(receiptTotal)?.toFixed(2) && 0}</Text>
            </CardBody>

            <CardBody>
                <Text>Despesa</Text>
                <Text  fontWeight={'bold'}>R$ {Number(expensesTotal)?.toFixed(2) && 0}</Text>
            </CardBody>

            <CardBody>
                <Text>Balanço Parcial</Text>
            <Flex>
                <Text 
                color={Number(receiptTotal) < Number(expensesPartial)  ? 'red' : 'green'}
                fontWeight={'bold'}>R${(Number(receiptTotal) - Number(expensesPartial))?.toFixed(2) && 0}</Text>
                <Stat maxW={'10%'} ml={'4px'}>
                    <StatArrow type={Number(receiptTotal) < Number(expensesPartial)  ? 'decrease' : 'increase'}/>
                </Stat>
            </Flex>
            </CardBody>

            <CardBody>
                <Text>Balanço Total</Text>
            <Flex>
                <Text 
                color={Number(receiptTotal) < Number(expensesTotal)  ? 'red' : 'green'}
                fontWeight={'bold'}>R${(Number(receiptTotal) - Number(expensesTotal))?.toFixed(2) && 0}</Text>
                <Stat maxW={'10%'} ml={'4px'}>
                    <StatArrow type={Number(receiptTotal) < Number(expensesTotal)  ? 'decrease' : 'increase'}/>
                </Stat>
            </Flex>
            </CardBody>
      </>
    );
}