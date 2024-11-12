import { CardBody, Flex, Stat, StatArrow, Text } from "@chakra-ui/react";

type Props = {
    receiptTotal: number;
    expensesTotal: number;
    expensesPartial: number;
}

export const CardValues = ({receiptTotal, expensesTotal, expensesPartial}: Props) => {

    const balancoParcial = receiptTotal != null && expensesPartial != null ? Number(receiptTotal) - Number(expensesPartial) : 0;
    const balancoTotal = receiptTotal != null && expensesTotal != null ? Number(receiptTotal) - Number(expensesTotal) : 0;
    receiptTotal = receiptTotal ? Number(receiptTotal) : 0;
    expensesTotal = expensesTotal ? Number(expensesTotal) : 0;

    return(
        <>
            <CardBody>
                <Text>Receita</Text>
                <Text  fontWeight={'bold'}>R$ {receiptTotal.toFixed(2)}</Text>
            </CardBody>

            <CardBody>
                <Text>Despesa</Text>
                <Text  fontWeight={'bold'}>R$ {expensesTotal.toFixed(2)}</Text>
            </CardBody>

            <CardBody>
                <Text>Balanço Parcial</Text>
            <Flex>
                <Text 
                color={Number(receiptTotal) < Number(expensesPartial)  ? 'red' : 'green'}
                fontWeight={'bold'}>R${balancoParcial.toFixed(2)}</Text>
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
                fontWeight={'bold'}>R${balancoTotal.toFixed(2)}</Text>
                
                <Stat maxW={'10%'} ml={'4px'}>
                    <StatArrow type={Number(receiptTotal) < Number(expensesTotal)  ? 'decrease' : 'increase'}/>
                </Stat>
            </Flex>
            </CardBody>
      </>
    );
}