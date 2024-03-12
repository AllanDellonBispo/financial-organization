import { Box, Text } from "@chakra-ui/react";

type Props = {
    resultSearch: Object[];
}

export const CardExpense = ({resultSearch}: Props) => {
    return(
        <Box boxShadow='2xl' p='6' rounded='md' bg='white' width="500px" height={"250px"} m={2}>
            <Text>Despesas total do período</Text>
            <Text display={'flex'} justifyContent={'center'} alignItems={'center'} h={'100%'} fontSize={46} fontWeight={'bold'} color={'green'}>R${resultSearch.reduce((acc:any, valor:any)=>acc+valor.total_debito,0)}</Text>
        </Box>
    );
}