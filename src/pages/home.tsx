//  
import { Flex, Box, Card, CardBody, Text, Button, Input, Select,
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
  Link,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerFooter} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { AiTwotoneEdit } from "react-icons/ai";
import { MdDelete, MdFileDownloadDone, MdOutlineClose, MdMonetizationOn, MdHelp } from "react-icons/md";
import { BsFillExclamationCircleFill, BsClipboardDataFill  } from "react-icons/bs";
import { FaFileDownload, FaRegEdit } from "react-icons/fa";
import { TfiClose } from "react-icons/tfi";
import { ImExit } from "react-icons/im";
import { Extract, changePage, createExtract, deleteRecord, downloadFiles, expenses, expensesNoCollaborators, paymentsOfMonth, receipt, searchInitial, searchNextMonth, searchPeriod, searchPeriodExpenses, searchPeriodGraphic, searchPeriodReceipt, searchPreviousMonth, updateExtract } from '../hooks/useExtract';
import { useForm } from 'react-hook-form';
import { Payment, createPayment, deletePayment, makePayment, searchPayments } from '../hooks/usePayment';
import { Link as LinkRouter, useNavigate } from "react-router-dom";
import { Header } from './components/HeaderPage';
import { CardInfo } from './components/CardInfo/CardInfo';
import { Pagination } from './components/Pagination';
import { FieldSearch } from './components/Dashboard/FieldSearch';
import { CardReceipt } from './components/Dashboard/CardReceipt';
import { CardExpense } from './components/Dashboard/CardExpense';
import { Graphic } from './components/Dashboard/Graphic';
import { LoggedUserContext } from '../contexts/LoggedUser';
import { ExtractCreate } from './components/Forms/ExtractCreate';
import { PaymentCreate } from './components/Forms/PaymentCreate';

function Home() {

  const [extractsInitial, setExtractsInitial] = useState<Extract[]>();
  const [expensesPartial, setExpensesPartial] = useState<Number>();
  const [expensesTotal, setExpensesTotal] = useState<Number>();
  const [receiptTotal, setReceiptTotal] = useState<Number>();
  const [month, setMonth] = useState<Number>(Number(new Date().getMonth())+1);
  const [loading, setLoading] = useState(false);
  const {register, handleSubmit} = useForm();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { status } = useContext(LoggedUserContext);
  const navigate = useNavigate();

  const { isOpen: isOpenSearch, onOpen: onOpenSearch, onClose: onCloseSearch } = useDisclosure();
  const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure();
  const { isOpen: isOpenMenu, onOpen: onOpenMenu, onClose: onCloseMenu } = useDisclosure();
  const { isOpen: isOpenPayment, onOpen: onOpenPayment, onClose: onClosePayment } = useDisclosure();
  const { isOpen: isOpenDeletePayment, onOpen: onOpenDeletePayment, onClose: onCloseDeletePayment } = useDisclosure();

  const [credits, setCredits] = useState(false);
  const [debts, setDebts] = useState(false);
  const [selectedExtract, setSelectedExtract] = useState<Extract | any>();
 
  const [dateInitial, setDateInitial] = useState<String>(new Date().toISOString().substring(0,10));
  const [dateFinal, setDateFinal] = useState<String>(new Date().toISOString().substring(0,10));
  const [activeFilter, setActiveFilter] = useState<String>('gray.200'); 
  const [proofTransaction, setProofTransaction] = useState<File | null>();

  const [paymentsMonth, setPaymentsMonth] = useState([]);
  const [payments, setPayments] = useState<Payment[]>();
  const [menuPayment, setMenuPayment] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment>();

  const [graphics, setGraphics] = useState<boolean>(false);
  const [resultSearch, setResultSearch] = useState<any>([]);

  const limit = 5;
  const [page, setPage] = useState(1);

  async function prevPageButton(){
    setPage(page === 1 ? 1 : page - 1);
    setExtractsInitial(await changePage(Number(month), (((page-1)*limit) - limit)));
    setActiveFilter('gray.200');
  }

  async function nextPageButton(){
      setExtractsInitial(await changePage(Number(month), page * limit));
      setPage(page + 1);
      setActiveFilter('gray.200');
  }

  const state = {
    options: {
      chart: {
        id: "basic-bar"
      },
      colors: [
        '#4B0082',
        '#E91E63',
        '#9C27B0'],
      xaxis: {
        categories: resultSearch.map((e:any) => e.mes_ano)
      }
    },
    series: [
      {
        name: "series-1",
        data: resultSearch.map((e:any) => e.total)
      }
    ]
  };

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

  async function searchExpensesPartial(month: number){
    setExpensesPartial(await expensesNoCollaborators(month));
  }

  async function searchPaymentsMonth(month: number){
    const payments = await paymentsOfMonth(Number(month));
    if(payments != null){
     setPaymentsMonth(payments);
    }
  }

  function verifyPayment(name : string): string | undefined{
    if (name) {
      const payment = paymentsMonth.find((e: any) => e.title === name);
      return payment ? 'green' : 'red';
    }
  }
  
  async function previousMonth(){
    setPage(1);
    if(Number(month) > 1){
      const monthUpdated = Number(month) - 1;
      setMonth(monthUpdated);
      searchExpenses(monthUpdated);
      searchReceipt(monthUpdated);
      searchPaymentsMonth(monthUpdated);
      searchExpensesPartial(monthUpdated);
      setExtractsInitial(await searchPreviousMonth(monthUpdated, Number(new Date().getFullYear())));
    }else{
      infoMessage(`Atenção`, `Para visualizar uma transação fora do ano atual use o recurso de filtro`, 6000);
    }
  }

  async function nextMonth(){
    setPage(1);
    if(Number(month) < 12){
      const monthUpdated = Number(month) + 1;
      setMonth(monthUpdated);
      searchExpenses(monthUpdated);
      searchReceipt(monthUpdated);
      searchPaymentsMonth(monthUpdated);
      searchExpensesPartial(monthUpdated);
      setExtractsInitial(await searchNextMonth(monthUpdated, Number(new Date().getFullYear())));
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

  async function searchPeriodOfGraphic(){
    try{
      setResultSearch(await searchPeriodGraphic(dateInitial, dateFinal));
    }catch{
      infoMessage('Atenção', 'insira uma data válida para realizar a pesquisa.', 4000);
    }
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
      alert(object)
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

  async function update(){
    setActiveFilter('gray.200');
    setLoading(true);
    updateExtract(selectedExtract)
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
  return dateValue ? String(new Date(dateValue).toISOString().substring(0,10)) : '';
}

async function searchPaymentsInitial(){
  setPayments(await searchPayments());
}

async function createPayments(object:any){
  setLoading(true);
  createPayment(JSON.stringify(object))
  .then(() => {
    searchPaymentsInitial();
    successMessage(`Sucesso`, `Despesa cadastrada!`, 3000);
}).catch((e:any)=>errorMessage(`Erro`, `${e}`, 6000))
.finally(()=> setLoading(false));
}

async function finalizePayment(id:number){
  setLoading(true);
  await makePayment(id)
  .then(() => {
    searchPaymentsInitial();
    searchPaymentsMonth(Number(month));
    searchExpenses(Number(month));
    searchReceipt(Number(month));
    successMessage(`Sucesso`, `Pagemento realizado!`, 3000);
}).catch((e:Error)=>errorMessage(`Erro`, `${e.message}`, 6000))
.finally(()=> setLoading(false));
}

async function excludePayment(){
  setLoading(true);
  try{
    if(selectedPayment?.id){
      await deletePayment(selectedPayment?.id);
      searchPaymentsInitial();
      successMessage('Sucesso', 'registro excluido', 4000);
    }
  }catch{
    errorMessage('Erro', 'tente novamente mais tarde', 4000);
  }finally{
    onCloseDeletePayment();
    setLoading(false);
  }
}

   useEffect( () => {
    if (!status) {
      navigate('/');
    }  
    searchInitialExtract();
    searchExpenses(Number(month));
    searchReceipt(Number(month));
    searchExpensesPartial(Number(month));
  },[]);

  //É necessário realizar uma alteração para ao mudar o nome de um extract verificar se ele é um payment e mudar o nome também ou vice-versa

  return (
    <Box>
      <Header title='Sistema Financeiro' onClick={onOpenMenu}/>

      <Flex display={'flex'} alignItems={'center'} direction={'column'} mt={-10}>

      <CardInfo
        month={returnMonth()}
        receiptTotal={Number(receiptTotal)}
        expensesTotal={Number(expensesTotal)}
        expensesPartial={Number(expensesPartial)}
        activeFilter={()=>setActiveFilter('gray.300')}
        bg={String(activeFilter)}
        activeButton={menuPayment || graphics ? true : false}
        nextMonth={nextMonth}
        previousMonth={previousMonth}
        onOpenSearch={async () => await onOpenSearch()} />
      
    {graphics ? 
        <FieldSearch
         dateInitial={dateInitial}
         dateFinal={dateFinal}
         onChangeDateInitial={(e)=> setDateInitial(e.target.value)}
         onChangeDateFinal={(e)=> setDateFinal(e.target.value)}
         searchPeriodOfGraphic={searchPeriodOfGraphic}/>:
    !menuPayment ?

    <ExtractCreate create={create} loading={loading} proofTransaction={proofTransaction} setProofTransaction={setProofTransaction}/> :
    <PaymentCreate createPayments={createPayments} loading={loading}/>}

    {graphics ?
    <Box boxShadow='2xl' p='6' rounded='md' bg='white' display={!graphics ? 'none': 'block'}>
    <Flex>
      <CardReceipt resultSearch={resultSearch}/>
      <CardExpense resultSearch={resultSearch}/>
    </Flex>
    <Graphic state={state}/>
  </Box>:

  <TableContainer w={'1000px'} >
  <Table variant='striped' w={'100%'}>
    <TableCaption fontWeight={'bold'}>Dados correspondente ao mês de {returnMonth()}</TableCaption>
    <Thead>
      
      {!menuPayment ?
      <Tr>
        <Th>Data</Th>
        <Th>Categoria</Th>
        <Th>Título</Th>
        <Th isNumeric>Valor</Th>
        <Th textAlign={'center'}>opções</Th>
      </Tr>: 
      
      <Tr>
        <Th>Nome</Th>
        <Th>Descrição</Th>
        <Th isNumeric>Valor</Th>
        <Th isNumeric>Total</Th>
        <Th>Status</Th>
        <Th textAlign={'center'}>opções</Th>
      </Tr> }
    </Thead>

    <Tbody>
      {!menuPayment ? extractsInitial?.map((extract) => (

      <React.Fragment key={extract.id}>
       <Tr key={extract.id}>
        <Td>{new Date(extract.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</Td>
        <Td>{extract.category}</Td>
        <Td>{extract.title}</Td>
        <Td textAlign={'end'} fontWeight={'bold'} color={extract.category === 'Débito' ? 'red': 'green'}>R${extract.value.toFixed(2)}</Td>
        <Td textAlign={'center'}>

        <Link href={`${downloadFiles(Number(extract?.id))}`} target='_self'>
        <IconButton
          isRound={true}
          variant='ghost'
          colorScheme='facebook'
          aria-label='Search database'
          icon={<FaFileDownload  size={'60%'}/>} onClick={()=> !extract.proofTransaction ? infoMessage('Atenção', 'A transação requisitada ainda não possui comprovante. Você pode adicionar um comprovante editando a mesma.', 7000):''} />
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
     </React.Fragment>
      )): 
      payments?.map((payment) => (
      <React.Fragment key={payment.id}>
         <Tr>
          <Td>{payment.name}</Td>
          <Td >{payment.description}</Td>
          <Td textAlign={'end'} fontWeight={'bold'}>{payment.category === 'Fixo' ? 'R$' : '%'}{payment.value.toFixed(2)}</Td>
          <Td textAlign={'end'} fontWeight={'bold'}>R${ (Number(receiptTotal) - Number(expensesTotal)) <= 0 ? Number(0).toFixed(2) : payment.category === 'Fixo' ? payment.value.toFixed(2) : ((payment.value/100) * (Number(receiptTotal) - Number(expensesPartial))).toFixed(2)}</Td>
          <Td color={(Number(receiptTotal) - Number(expensesTotal)) <= 0 ? 'green' : verifyPayment(payment.name)} fontWeight='bold'>{(Number(receiptTotal) - Number(expensesTotal)) <= 0 ? 'Sem pendências' :
           paymentsMonth.find((e:any)=> payment.name === e.title) ? 'Realizado' : 'Pendente'}</Td>
          <Td textAlign={'center'}>

          <IconButton
            isRound={true}
            variant='ghost'
            colorScheme='green'
            aria-label='Search database'
            icon={<MdMonetizationOn  size={'60%'} />} onClick={()=>{
                                                                    onOpenPayment();
                                                                    setSelectedPayment(payment)}}/>
  
          <IconButton
            isRound={true}
            variant='ghost'
            colorScheme='facebook'
            aria-label='Search database'
            icon={<AiTwotoneEdit size={'60%'} />} onClick={()=>{
                                                                setSelectedExtract(payment);
                                                                onOpenUpdate()}}
            />
            <IconButton
            isRound={true}
            variant='ghost'
            colorScheme='red'
            aria-label='Search database'
            icon={<MdDelete size={'60%'} />} onClick={()=>{onOpenDeletePayment(); setSelectedPayment(payment)}}/>
        </Td>
       </Tr>
       </React.Fragment>
        ))}
    </Tbody>
  </Table>

    <Pagination
    displayPrevious={page === 1 ? true : false}
    displayNext={extractsInitial?.length !== undefined && extractsInitial?.length < limit ? true : false}
    numberPage={page}
    nextPageButton={nextPageButton}
    prevPageButton={prevPageButton} />

</TableContainer>}

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
            <Button bg={'#4B0082'} color={'white'} mr={3} _hover={{color:'white', backgroundColor:'#6801b3'}} onClick={deleteExtract} isLoading={loading}>
              Tenho certeza
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal closeOnOverlayClick={false} isOpen={isOpenDeletePayment} onClose={onCloseDeletePayment} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={'flex'} alignItems={'center'}>
            <Text color='orange' mr={'4px'}>Atenção</Text>
            <BsFillExclamationCircleFill color='orange'/>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>Deseja excluir esse registro ?</Text>
          </ModalBody>

          <ModalFooter>
            <Button bg={'#4B0082'} color={'white'} mr={3} _hover={{color:'white', backgroundColor:'#6801b3'}} onClick={excludePayment} isLoading={loading}>
              Tenho certeza
            </Button>
            <Button onClick={onCloseDeletePayment}>Cancelar</Button>
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

          <Flex id='formUpdate' as={'form'} display={'flex'} flexDirection={'column'} w={'100%'}>
            <Card direction={'column'} >

              <Flex>
              <CardBody>
                <Text>Data</Text>
                <Input
                placeholder="Selecione uma data"
                size="md"
                type="date"
                required
                defaultValue={dateFormated(selectedExtract?.date)}
                onChange={(e:any)=> setSelectedExtract({...selectedExtract, date: e.target.value})}/>
              </CardBody>

              <CardBody>
              <Text>Categoria</Text>
              {selectedExtract?.category === 'Crédito' ?
              <Select onChange={(e:any)=> setSelectedExtract({...selectedExtract, category: e.target.value})}>
                <option value='Crédito'>Creditar</option>
                <option value='Débito'>Debitar</option>
              </Select>:
              <Select onChange={(e:any)=> setSelectedExtract({...selectedExtract, category: e.target.value})}>
              <option value='Débito'>Debitar</option>
              <option value='Crédito'>Creditar</option>
            </Select>}
              </CardBody>
              </Flex>

        <CardBody>
          <Text>Titulo</Text>
          <Input
           defaultValue={selectedExtract?.title}
           onChange={(e)=> {setSelectedExtract({...selectedExtract, title:e.target.value})}}
           />
        </CardBody>

        <Flex>
        <CardBody>
          <Text>Valor</Text>
          <Flex>

          <NumberInput defaultValue={selectedExtract?.value} min={0.1} max={99999999}>
            <NumberInputField onChange={(e)=> setSelectedExtract({...selectedExtract, value:e.target.value})} />
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
          onChange={(e:any)=>setProofTransaction(e.target.files?.item(0))}/>
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
            <Button type='submit' justifyContent={'space-between'} isLoading={loading} bg={'#4B0082'} color={'white'} mr={3} _hover={{color:'white', backgroundColor:'#6801b3'}} onClick={update}>
              Atualizar
            </Button>
            <Button onClick={()=>onCloseUpdate()}>Cancelar</Button>
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
              onChange={(e:any)=> setDateInitial(e.target?.value)}
            />
          </ModalBody>
          <ModalBody pb={6}>
            <Text>Período final</Text>
            <Input
              placeholder="Select Date final"
              size="md"
              type="date"
              onChange={(e:any)=> setDateFinal(e.target.value)}
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
            <Button bg={'#4B0082'} color={'white'} mr={3} _hover={{color:'white', backgroundColor:'#6801b3'}} onClick={()=>{setActiveFilter('red');onCloseSearch(); searchFilter()}} isLoading={loading}>
              Buscar
            </Button>
            <Button onClick={onCloseSearch}>Cancelar</Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>


      <Modal closeOnOverlayClick={false} isOpen={isOpenPayment} onClose={onClosePayment} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={'flex'} alignItems={'center'}>
            <Text color='orange' mr={'4px'}>Atenção</Text>
            <BsFillExclamationCircleFill color='orange'/>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>Deseja concluir o pagamento ?</Text>
          </ModalBody>

          <ModalFooter>
            <Button bg={'#4B0082'} color={'white'} mr={3} _hover={{color:'white', backgroundColor:'#6801b3'}} onClick={()=>{finalizePayment(Number(selectedPayment?.id));onClosePayment()}} isLoading={loading}>
              Concluir
            </Button>
            <Button onClick={onClosePayment}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Drawer
        isOpen={isOpenMenu}
        placement='left'
        onClose={onCloseMenu}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton color={'white'}/>
          <DrawerHeader bg={'#4B0082'} color={'white'}>Menu</DrawerHeader>

          <DrawerBody display={'flex'} flexDirection={'column'} gap={2}>
                  <Link textDecoration={'none'} onClick={()=> {searchInitialExtract(); setMenuPayment(false); setGraphics(false); onCloseMenu()}} _hover={{'fontSize':20, 'fontWeight':500, 'color':'#4B0082', 'transition':'100ms linear'}}>Início</Link>
                  <Link onClick={()=>{searchPaymentsInitial(); searchPaymentsMonth(Number(month)); setMenuPayment(true); setGraphics(false); onCloseMenu(); setActiveFilter('gray.200')}} _hover={{'fontSize':20, 'fontWeight':500, 'color':'#4B0082', 'transition':'100ms linear'}}>Acertos</Link>
                  <Link _hover={{'fontSize':20, 'fontWeight':500, 'color':'#4B0082', 'transition':'100ms linear'}} onClick={()=> {setMenuPayment(false); setGraphics(true); onCloseMenu(); setActiveFilter('gray.200')}}>Estatísticas</Link>
          </DrawerBody>

          <DrawerFooter display={'flex'} justifyContent={'space-between'}>
            <MdHelp size={22} />
            <LinkRouter to='/'>
              <ImExit color='red' size={22}/>
            </LinkRouter>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      </Flex>
    </Box>
  );
}

export default Home;
