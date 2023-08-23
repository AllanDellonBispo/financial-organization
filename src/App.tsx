//  
import { Flex, Box, Heading, Card, CardBody, Text, Button, Input, Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { Extract, createExtract, expenses, receipt, searchInitial } from './hooks/useExtract';
import { useForm } from 'react-hook-form';

function App() {

  function returnMonth() {
    const currentDate = new Date().getMonth();
    switch(currentDate+1){
      case 1:
        return 'Janeiro';
      case 2:
        return 'Favereiro';
      case 3:
        return 'Março';
      case 4:
        return 'Abril';
      case 5:
        return 'Maio';
      case 6:
        return 'Junho';
      case 7:
        return 'Julho';
      case 8:
        return 'Agosto';
      case 9:
        return 'Setembro';
      case 10:
        return 'Outubro';
      case 11:
        return 'Novembro';
      case 12:
        return 'Dezembro';
    }
  }

  const [extractsInitial, setExtractsInitial] = useState<Extract[]>();
  const [expensesTotal, setExpensesTotal] = useState<Number>();
  const [receiptTotal, setReceiptTotal] = useState<Number>();
  const{register, handleSubmit} = useForm();
  const [loading, setLoading] = useState(false);

  async function searchExpenses(){
    setExpensesTotal(await expenses(new Date().getMonth()));
  }

  async function searchReceipt(){
    setReceiptTotal(await receipt(new Date().getMonth()));
  }

  async function searchInitialExtract(){
    setExtractsInitial(await searchInitial());
  }


  async function create(object:any){
      setLoading(true);
      createExtract(JSON.stringify(object))
      .then(() => {
        searchInitialExtract();
        searchExpenses();
        searchReceipt();
  }).catch((e)=>console.log(e))
  .finally(()=> setLoading(false));
  }

   useEffect( () => {
    searchInitialExtract();
    searchExpenses();
    searchReceipt();
  },[]);


  //Fazer lista ser atualizada ao acadastrar um novo extract
  //Pesquisa mensal
  //Pesquisa por período específico


  return (
    <Box>
      <Heading>
        <Flex bg={'#4B0082'} color={'white'} h={'150px'} fontSize={28} display={'flex'} justifyContent={'center'}>
          <Text p={4}>Sistema Financeiro</Text>
        </Flex>
      </Heading>
      <Flex display={'flex'} alignItems={'center'} direction={'column'} mt={-10}>
      
      <Card display={'flex'} direction={'row'} w={'1000px'} mb={4}>
        <CardBody>
          <Flex gap={4}>
            <Button colorScheme='yellow'>
              <AiOutlineArrowLeft color={'white'}/>
            </Button>
            <Text alignSelf={'center'}>{returnMonth()}</Text>
            <Button colorScheme='yellow'>
              <AiOutlineArrowRight color={'white'}/>
            </Button>
          </Flex>
        </CardBody>
        <CardBody>
          <Text>Receita</Text>
          <Text  fontWeight={'bold'}>R$ {(receiptTotal)?.toFixed(2)}</Text>
        </CardBody>
        <CardBody>
          <Text>Despesa</Text>
          <Text  fontWeight={'bold'}>R$ {(expensesTotal)?.toFixed(2)}</Text>
        </CardBody>
        <CardBody>
          <Text>Balanço</Text>
          <Text 
          color={Number(receiptTotal) < Number(expensesTotal)  ? 'red' : 'green'}
          fontWeight={'bold'}>R${(Number(receiptTotal) - Number(expensesTotal)).toFixed(2)}</Text>
        </CardBody>
      </Card>

    <Flex as={'form'} onSubmit={handleSubmit(create)} display={'flex'} w={'1000px'}>
      <Card direction={'row'} >
        <CardBody>
          <Flex direction={'column'}>
            <Text>Data</Text>
            <Input
            
            placeholder="Select Date and Time"
            size="md"
            type="date"
            {...register("date")}
            />
          </Flex>
        </CardBody>
        <CardBody>
          <Text>Categoria</Text>
          <Select w={'150px'} {...register("category")}>
          <option value='Crédito'>Creditar</option>
          <option value='Débito'>Debitar</option>
          </Select>
        </CardBody>
        <CardBody>
          <Text>Titulo</Text>
          <Input placeholder='Salário' {...register("title")} />
        </CardBody>
        <CardBody>
          <Text>Valor</Text>
          <Flex>
          {/* <Text fontSize={'28px'}>R$</Text> */}
          <NumberInput defaultValue={100} min={0.1} max={99999999} >
            <NumberInputField {...register("value")} />
            <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          </Flex>
        </CardBody>
        <CardBody alignSelf={'end'}>
        
        <Button colorScheme='yellow' type='submit' isLoading={loading}>Adicionar</Button>
        </CardBody>
      </Card>
      </Flex>

  <TableContainer w={'1000px'} >
  <Table variant='striped'>
    <TableCaption fontWeight={'bold'}>Dados correspondente ao mês de {returnMonth()}</TableCaption>
    <Thead>
      <Tr>
        <Th>Data</Th>
        <Th>Categoria</Th>
        <Th>Título</Th>
        <Th isNumeric>Valor</Th>
      </Tr>
    </Thead>
    <Tbody>
      {extractsInitial?.map((extract) => {
      return(
        <>
       <Tr key={extract.id}>
        <Td>{new Date(extract.date).toLocaleDateString('pt-BR')}</Td>
        <Td>{extract.category}</Td>
        <Td>{extract.title}</Td>
        <Td textAlign={'end'} fontWeight={'bold'} color={extract.category === 'Débito' ? 'red': 'green'}>R${extract.value}</Td>
     </Tr>
     </>
      )
      })}
    </Tbody>
    {/* <Tfoot>
      <Tr>
        <Th>To convert</Th>
        <Th>To convert</Th>
        <Th>into</Th>
        <Th isNumeric>multiply by</Th>
      </Tr>
    </Tfoot> */}
  </Table>
</TableContainer>

      </Flex>
    </Box>
  );
}

export default App;
