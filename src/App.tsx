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
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer, } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { Extract, searchInitial } from './hooks/useExtract';

function App() {

  function returnMonth() {
    const currentDate = new Date().getMonth();
    switch(currentDate+1){
      case 1:
        return 'Janeiro';
        break;
      case 2:
        return 'Favereiro';
        break;
      case 3:
        return 'Março';
        break;
      case 4:
        return 'Abril';
        break;
      case 5:
        return 'Maio';
        break;
      case 6:
        return 'Junho';
        break;
      case 7:
        return 'Julho';
        break;
      case 8:
        return 'Agosto';
        break;
      case 9:
        return 'Setembro';
        break;
      case 10:
        return 'Outubro';
        break;
      case 11:
        return 'Novembro';
        break;
      case 12:
        return 'Dezembro';
        break;
    }
  }

  const [extractsInitial, setExtractsInitial] = useState<Extract[]>();

  async function searchInitialExtract(){
    setExtractsInitial(await searchInitial());
    console.log(extractsInitial);
  }

  useEffect( () => {
    searchInitialExtract();
  },[]);

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
          <Text color={10 < 2  ? 'red' : 'green'} fontWeight={'bold'}>R$ 0.00</Text>
        </CardBody>
        <CardBody>
          <Text>Despesa</Text>
          <Text color={10 > 2  ? 'red' : 'green'} fontWeight={'bold'}>R$ 2360.12</Text>
        </CardBody>
        <CardBody>
          <Text>Balanço</Text>
          <Text color={10 > 2  ? 'red' : 'green'} fontWeight={'bold'}>R$ -2360.12</Text>
        </CardBody>
      </Card>

      <Card display={'flex'} direction={'row'} alignItems={'center'} w={'1000px'}>
        <CardBody>
          <Flex direction={'column'}>
            <Text>Data</Text>
            <Input
            placeholder="Select Date and Time"
            size="md"
            type="date"
            />
          </Flex>
        </CardBody>
        <CardBody>
          <Text>Categoria</Text>
          <Select w={'150px'}>
          <option value='option1'>Creditar</option>
          <option value='option2'>Debitar</option>
          </Select>
        </CardBody>
        <CardBody>
          <Text>Titulo</Text>
          <Input placeholder='Salário' />
        </CardBody>
        <CardBody>
          <Text>Valor</Text>
          <Flex>
          {/* <Text fontSize={'28px'}>R$</Text> */}
          <NumberInput defaultValue={100} min={0.1} max={99999999}>
            <NumberInputField />
            <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          </Flex>
        </CardBody>
        <CardBody alignSelf={'end'}>
        
        <Button colorScheme='yellow'>Adicionar</Button>
        </CardBody>
      </Card>

  <TableContainer w={'1000px'} >
  <Table variant='simple'>
    <TableCaption>Imperial to metric conversion factors</TableCaption>
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
        <Td textAlign={'end'} fontWeight={'bold'} color={extract.value > 0 ? 'green': 'red'}>R${extract.value}</Td>
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
