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
  useToast,
  StatArrow,
  Stat,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  HStack,
  Tag,
  TagLabel,
  FormLabel,
  Link} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiTwotoneEdit } from "react-icons/ai";
import { MdDelete, MdFileDownloadDone, MdOutlineClose } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { BsFillExclamationCircleFill, BsClipboardDataFill  } from "react-icons/bs";
import { FaFileDownload, FaRegEdit } from "react-icons/fa";
import { TfiClose } from "react-icons/tfi";
import { VscSettings } from "react-icons/vsc";
import { Extract, createExtract, deleteRecord, downloadFiles, expenses, receipt, searchInitial, searchNextMonth, searchPeriod, searchPeriodExpenses, searchPeriodReceipt, searchPreviousMonth, updateExtract } from './hooks/useExtract';
import { useForm } from 'react-hook-form';


function App() {

  const [extractsInitial, setExtractsInitial] = useState<Extract[]>();
  const [expensesTotal, setExpensesTotal] = useState<Number>();
  const [receiptTotal, setReceiptTotal] = useState<Number>();
  const [month, setMonth] = useState<Number>(Number(new Date().getMonth())+1);
  const [loading, setLoading] = useState(false);
  const {register, handleSubmit} = useForm();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenSearch, onOpen: onOpenSearch, onClose: onCloseSearch } = useDisclosure();
  const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure();
  const [credits, setCredits] = useState(false);
  const [debts, setDebts] = useState(false);
  const [selectedExtract, setSelectedExtract] = useState<Extract>();
  const [dateInitial, setDateInitial] = useState<String>();
  const [dateFinal, setDateFinal] = useState<String>();
  const [activeFilter, setActiveFilter] = useState<String>('gray.200'); 
  const [proofTransaction, setProofTransaction] = useState<File | null>();

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

  function infoMessage (title:string, description:string, duration:number){
    toast({
      title,
      description,
      status: 'info',
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
      setExtractsInitial(await searchPreviousMonth(Number(month), Number(new Date().getFullYear())));
    }else{
      infoMessage(`Atenção`, `Para visualizar uma transação fora do ano atual use o recurso de filtro`, 6000);
    }
  }

  async function nextMonth(){
    if(Number(month) < 12){
      const monthUpdated = Number(month) + 1;
      setMonth(monthUpdated);
      searchExpenses(monthUpdated);
      searchReceipt(monthUpdated);
      setExtractsInitial(await searchNextMonth(Number(month), Number(new Date().getFullYear())));
    }else{
      infoMessage(`Atenção`, `Para visualizar uma transação fora do ano atual use o recurso de filtro.`, 6000);
    }
  }

  async function searchFilter(){
    if(credits === true){
      setExtractsInitial(await searchPeriodReceipt(dateInitial, dateFinal));
    }else if(debts === true){
      setExtractsInitial(await searchPeriodExpenses(dateInitial, dateFinal));
    }else{
    setExtractsInitial(await searchPeriod(dateInitial, dateFinal));
    }
    setDebts(false);
    setCredits(false);
  }

async function deleteExtract(){
  deleteRecord(Number(selectedExtract?.id))
    .then(()=>{
      searchInitialExtract();
      searchExpenses(Number(month));
      searchReceipt(Number(month));
    });
  successMessage(`Sucesso`, `O registro foi excluido!`, 2000);
  onClose();
}

  async function create(object:any){
      setActiveFilter('gray.200');
      setLoading(true);
      object.proofTransaction = proofTransaction;
      createExtract(object)
      .then(() => {
        setProofTransaction(null);
        searchInitialExtract();
        searchExpenses(Number(month));
        searchReceipt(Number(month));
        successMessage(`Sucesso`, `Transação cadastrada!`, 3000);
  }).catch((e:any)=>errorMessage(`Erro`, `${e}`, 6000))
  .finally(()=> setLoading(false));
  }

  async function update(data:any){
    console.log('Foiiiii1',selectedExtract)
    setActiveFilter('gray.200');
    setLoading(true);
    data.proofTransactionUpdate = proofTransaction;
    data.id = selectedExtract?.id;
    console.log('Foiiiii2',data)
    updateExtract(data)
    .then(() => {
      setProofTransaction(null);
      searchInitialExtract();
      searchExpenses(Number(month));
      searchReceipt(Number(month));
      onCloseUpdate();
      successMessage(`Sucesso`, `Transação atualizada!`, 3000);
}).catch((e:any)=>errorMessage(`Erro`, `${e}`, 6000))
.finally(()=> setLoading(false));
}

const dateFormated = (dateValue: Date | undefined) => {
  return String(dateValue).toString().substring(0,10);
}

   useEffect( () => {
    searchInitialExtract();
    searchExpenses(Number(month));
    searchReceipt(Number(month));
  },[]);

  //Fazer paginação
  //Adicionar gráficos
  //Adicionar notas fiscais

  return (
    <Box>
      <Heading>
        <Flex bg={'#4B0082'} color={'white'} h={'150px'} fontSize={28} display={'flex'} justifyContent={'space-between'} align={'center'}>
          <Box ml={'4%'}>
            <RiMoneyDollarCircleLine size={'30%'}/>
          </Box>
          <Text>Sistema Financeiro</Text>
          <Box>
            <RiMoneyDollarCircleLine size={'30%'}/>
          </Box>
        </Flex>
      </Heading>
      <Flex display={'flex'} alignItems={'center'} direction={'column'} mt={-10}>
      
      <Card display={'flex'} direction={'row'} w={'1000px'} mb={4} alignItems={'center'}>
        <CardBody>
          <Flex gap={4} alignItems={'center'}>
            <Button bg={'#4B0082'} _hover={{backgroundColor:'#7600ca'}} onClick={()=>{previousMonth();setActiveFilter('gray.200')}}>
              <AiOutlineArrowLeft color={'white'}/>
            </Button>
            <Text alignSelf={'center'}>{returnMonth()}</Text>
            <Button bg={'#4B0082'} _hover={{backgroundColor:'#7600ca'}} onClick={()=>{nextMonth(); setActiveFilter('gray.200')}}>
              <AiOutlineArrowRight color={'white'}/>
            </Button>
            <Box>
              <Button onClick={onOpenSearch} title='Filtrar' bg={String(activeFilter)} >
                <VscSettings />
              </Button>
            </Box>
          </Flex>
        </CardBody>
        <CardBody>
          <Text>Receita</Text>
          <Text  fontWeight={'bold'}>R$ {Number(receiptTotal)?.toFixed(2)}</Text>
        </CardBody>
        <CardBody>
          <Text>Despesa</Text>
          <Text  fontWeight={'bold'}>R$ {Number(expensesTotal)?.toFixed(2)}</Text>
        </CardBody>
        <CardBody>
          <Text>Balanço</Text>
          <Flex>
          <Text 
          color={Number(receiptTotal) < Number(expensesTotal)  ? 'red' : 'green'}
          fontWeight={'bold'}>R${(Number(receiptTotal) - Number(expensesTotal))?.toFixed(2)}</Text>
            <Stat maxW={'10%'} ml={'4px'}>
              <StatArrow type={Number(receiptTotal) < Number(expensesTotal)  ? 'decrease' : 'increase'}/>
            </Stat>
          </Flex>
        </CardBody>
      </Card>

    <Flex id='formCreate' as={'form'} onSubmit={handleSubmit(create)} display={'flex'} w={'1000px'}>
      <Card direction={'row'} >
        <CardBody>
          <Flex direction={'column'}>
            <Text>Data</Text>
            <Input
            placeholder="Selecione uma data"
            size="md"
            type="date"
            required
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
          <Input placeholder='Salário' required {...register("title")} />
        </CardBody>
        <CardBody>
          <Text>Valor</Text>
          <Flex>
          {/* <Text fontSize={'28px'}>R$</Text> */}
          <NumberInput defaultValue={100} min={0.1} max={99999999} >
            <NumberInputField required {...register("value")} />
            <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          </Flex>
        </CardBody>
        <CardBody >
          <Text>Comprovante</Text>
          <Flex justifyContent={'center'} alignItems={'center'}>
          <FormLabel htmlFor='proofTransactionUpload' w={'100%'} border={'1px solid #f0f3f7'} borderRadius={4} bg={proofTransaction ? 'green' : 'white'} display={'flex'} justifyContent={'center'} >
          {!proofTransaction ?
          <Text fontSize={14} color={'gray.400'} textAlign={'center'}>Clique para adicionar</Text> :
       
            <MdFileDownloadDone fontSize={40} color={proofTransaction ? 'white' : 'gray'} width={'100%'}/>
          
          }
          <Input
          id='proofTransactionUpload'
          type='file'
          placeholder='clique para adicionar o comprovante' 
          display={'none'}
          {...register("proofTransaction")}
          onChange={(e)=>setProofTransaction(e.target.files?.item(0))}/>
          </FormLabel>
          {proofTransaction ?
          <MdOutlineClose fontSize={20} onClick={()=>setProofTransaction(null)}/> :
          ''
        }
          </Flex>
          
        </CardBody>
        <CardBody alignSelf={'end'}>
        <Button bg={'#4B0082'} type='submit' color={'white'} isLoading={loading} _hover={{backgroundColor:'#7600ca'}}>Adicionar</Button>
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
        <Th textAlign={'center'}>opções</Th>
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
        <Td textAlign={'end'} fontWeight={'bold'} color={extract.category === 'Débito' ? 'red': 'green'}>R${extract.value.toFixed(2)}</Td>
        <Td textAlign={'center'}>

        <Link href={`${downloadFiles(Number(selectedExtract?.id))}`} target='_self'>
        <IconButton
          isRound={true}
          variant='ghost'
          colorScheme='facebook'
          aria-label='Search database'
          icon={<FaFileDownload  size={'60%'} />} onClick={()=>{setSelectedExtract(extract)}}/>
          </Link>

        <IconButton
          isRound={true}
          variant='ghost'
          colorScheme='facebook'
          aria-label='Search database'
          icon={<AiTwotoneEdit size={'60%'} />} onClick={()=>{
                                                              setSelectedExtract(extract);
                                                              setProofTransaction(extract.proofTransaction);
                                                              onOpenUpdate()}}
          />
          <IconButton
          isRound={true}
          variant='ghost'
          colorScheme='red'
          aria-label='Search database'
          icon={<MdDelete size={'60%'} />} onClick={()=>{onOpen(); setSelectedExtract(extract)}}/>
      </Td>
     </Tr>
     </>
      )
      })}
    </Tbody>
  </Table>
</TableContainer>

  <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={'flex'} alignItems={'center'}>
            <Text color='orange' mr={'4px'}>Atenção</Text>
            <BsFillExclamationCircleFill color='orange'/>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>Deseja excluir essa transação ?</Text>
          </ModalBody>

          <ModalFooter>
            <Button bg={'#4B0082'} color={'white'} mr={3} _hover={{color:'white', backgroundColor:'#6801b3'}} onClick={deleteExtract}>
              Tenho certeza
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal closeOnOverlayClick={false} isOpen={isOpenUpdate} onClose={onCloseUpdate} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={'flex'} alignItems={'center'}>
            <Text  mr={'4px'}>Realize as alterações necessárias</Text>
            <FaRegEdit/>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>

          <Flex id='formUpdate' as={'form'} onSubmit={(event)=>{event.stopPropagation(); handleSubmit(update)(event)}} display={'flex'} flexDirection={'column'} w={'100%'}>
            <Card direction={'column'} >

              <Flex>
              <CardBody>
                <Text>Data</Text>
                <Input
                placeholder="Selecione uma data"
                size="md"
                type="date"
                required
                {...register("dateUpdate")}
                defaultValue={dateFormated(selectedExtract?.date)}
                />
              </CardBody>

              <CardBody>
              <Text>Categoria</Text>
              {selectedExtract?.category === 'Crédito' ?
              <Select {...register("categoryUpdate")}>
                <option value='Crédito'>Creditar</option>
                <option value='Débito'>Debitar</option>
              </Select>:
              <Select {...register("categoryUpdate")}>
              <option value='Débito'>Debitar</option>
              <option value='Crédito'>Creditar</option>
            </Select>}
              </CardBody>
              </Flex>

        <CardBody>
          <Text>Titulo</Text>
          <Input required {...register("titleUpdate")} defaultValue={selectedExtract?.title}/>
        </CardBody>

        <Flex>
        <CardBody>
          <Text>Valor</Text>
          <Flex>
          {/* <Text fontSize={'28px'}>R$</Text> */}
          <NumberInput defaultValue={selectedExtract?.value} min={0.1} max={99999999} >
            <NumberInputField required {...register("valueUpdate")} />
            <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          </Flex>
        </CardBody>
        <CardBody >
          <Text>Comprovante</Text>
          {/* <Input bg={'yellow'} type='file' placeholder='clique para adicionar o comprovante' {...register("proofTransactionUpload")} onChange={(e)=>setProofTransaction(e.target.files?.item(0))}/> */}
          <Flex justifyContent={'center'} alignItems={'center'}>
          <FormLabel htmlFor='proofTransactionUpdate' w={'100%'} h={10} border={'1px solid #f0f3f7'} borderRadius={4} bg={proofTransaction ? 'green' : 'white'} display={'flex'} justifyContent={'center'} >
          {!proofTransaction ?
          <Text fontSize={14} color={'gray.400'} textAlign={'center'}>Clique para adicionar</Text> :
          <MdFileDownloadDone fontSize={40} color={proofTransaction ? 'white' : 'gray'} width={'100%'}/>
          }
          <Input
          id='proofTransactionUpdate'
          type='file'
          placeholder='clique para adicionar o comprovante' 
          display={'none'}
          {...register("proofTransactionUpdate")}
          onChange={(e)=>setProofTransaction(e.target.files?.item(0))}/>
          </FormLabel>
          {proofTransaction ?
          <MdOutlineClose fontSize={20} onClick={()=>setProofTransaction(null)}/> :
          ''
        }
          </Flex>
        </CardBody>
        </Flex>
      </Card>
      </Flex>
          </ModalBody>

          <ModalFooter>
            <Button type='submit' justifyContent={'space-between'} isLoading={loading} bg={'#4B0082'} color={'white'} mr={3} _hover={{color:'white', backgroundColor:'#6801b3'}} onClick={()=>handleSubmit(update)}>
              Atualizar
            </Button>
            <Button onClick={()=>{onCloseUpdate()}}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal closeOnOverlayClick={false} isOpen={isOpenSearch} onClose={onCloseSearch} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={'flex'} alignItems={'center'}>
            <Text mr={'4px'}>Pesquisa avançada</Text>
            <BsClipboardDataFill />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>Período inicial</Text>
            <Input
              placeholder="Select Date initial"
              size="md"
              type="date"
              onChange={(e)=> setDateInitial(e.target?.value)}
            />
          </ModalBody>
          <ModalBody pb={6}>
            <Text>Período final</Text>
            <Input
              placeholder="Select Date final"
              size="md"
              type="date"
              onChange={(e)=> setDateFinal(e.target.value)}
            />
          </ModalBody>
          <ModalBody display={'flex'} justifyContent={'space-around'} pb={6}>
            <Checkbox isChecked={credits} onChange={()=>{setDebts(false); setCredits(true)}}>Apenas créditos</Checkbox>
            <Checkbox isChecked={debts} onChange={()=>{setCredits(false); setDebts(true)}}>Apenas débitos</Checkbox>
          </ModalBody>

          <ModalFooter display={'flex'} justifyContent={'space-between'}>
            <Box as='button' onClick={()=>{searchInitialExtract(); onCloseSearch(); setActiveFilter('gray.200')}}>
            <HStack spacing={4}>
              <Tag size={'sm'} variant='solid' colorScheme='purple'>
                <TagLabel mr={2}>Limpar filtros</TagLabel>
                < TfiClose/>
              </Tag>
          </HStack>
            </Box>
            <Flex>
            <Button bg={'#4B0082'} color={'white'} mr={3} _hover={{color:'white', backgroundColor:'#6801b3'}} onClick={()=>{setActiveFilter('red');onCloseSearch(); searchFilter()}}>
              Buscar
            </Button>
            <Button onClick={onCloseSearch}>Cancelar</Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>


      </Flex>
    </Box>
  );
}

export default App;
