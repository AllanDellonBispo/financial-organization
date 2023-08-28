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
  TableContainer, 
  useToast} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { Extract, createExtract, expenses, receipt, searchInitial, searchNextMonth, searchPreviousMonth } from './hooks/useExtract';
import { useForm } from 'react-hook-form';

function App() {

  const [extractsInitial, setExtractsInitial] = useState<Extract[]>();
  const [expensesTotal, setExpensesTotal] = useState<Number>();
  const [receiptTotal, setReceiptTotal] = useState<Number>();
  const [month, setMonth] = useState<Number>(Number(new Date().getMonth())+1);
  const [loading, setLoading] = useState(false);
  const {register, handleSubmit} = useForm();
  const toast = useToast();
  
  function returnMonth() {
    switch(Number(month)){
      case 1:
        return 'Janeiro';
      case 2:
        return 'Fevereiro';
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
        
  function successMessage (title:string, description:string, duration:number){
          toast({
            title,
            description,
            status: 'success',
            duration,
            isClosable: true,
            position: 'top-left',
          })
  }
      
  function errorMessage (title:string, description:string, duration:number){
          toast({
            title,
            description,
            status: 'error',
            duration,
            isClosable: true,
            position: 'top-left',
          })
  }

  async function searchExpenses(month:Number){
    setExpensesTotal(await expenses(Number(month)));
  }
  
  async function searchReceipt(month:Number){
    setReceiptTotal(await receipt(Number(month)));
  }
  
  async function searchInitialExtract(){
    setExtractsInitial(await searchInitial());
  }
  
  async function previousMonth(){
    if(Number(month) > 1){
      const monthUpdated = Number(month) - 1;
      setMonth(monthUpdated);
      searchExpenses(monthUpdated);
      searchReceipt(monthUpdated);
      setExtractsInitial(await searchPreviousMonth(Number(month)));
    }else{
      errorMessage(`Erro`, `Não existe registos anteriores a esse mês`, 6000);
    }
  }

  async function nextMonth(){
    if(Number(month) < 12){
      const monthUpdated = Number(month) + 1;
      setMonth(monthUpdated);
      searchExpenses(monthUpdated);
      searchReceipt(monthUpdated);
      setExtractsInitial(await searchNextMonth(Number(month)));
    }else{
      errorMessage(`Erro`, `Não existe registos posteriores a esse mês`, 6000);
    }
  }



  async function create(object:any){
      setLoading(true);
      createExtract(JSON.stringify(object))
      .then(() => {
        searchInitialExtract();
        searchExpenses(Number(month));
        searchReceipt(Number(month));
        successMessage(`Sucesso`, `Transação cadastrada!`, 3000);
  }).catch((e)=>errorMessage(`Erro`, `${e}`, 6000))
  .finally(()=> setLoading(false));
  }

   useEffect( () => {
    searchInitialExtract();
    searchExpenses(Number(month));
    searchReceipt(Number(month));
  },[]);


  //Mostrar Receita, Despesa e Balanço mensal
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
            <Button colorScheme='yellow' onClick={previousMonth}>
              <AiOutlineArrowLeft color={'white'}/>
            </Button>
            <Text alignSelf={'center'}>{returnMonth()}</Text>
            <Button colorScheme='yellow' onClick={nextMonth}>
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
        
        <Button colorScheme='yellow' type='submit' color={'white'} isLoading={loading}>Adicionar</Button>
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
