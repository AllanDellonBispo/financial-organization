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
  Link,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerFooter} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiTwotoneEdit } from "react-icons/ai";
import { MdDelete, MdFileDownloadDone, MdOutlineClose, MdMonetizationOn  } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { BsFillExclamationCircleFill, BsClipboardDataFill  } from "react-icons/bs";
import { FaFileDownload, FaRegEdit } from "react-icons/fa";
import { TfiClose } from "react-icons/tfi";
import { VscSettings } from "react-icons/vsc";
import { TiThMenu } from "react-icons/ti";
import { ImExit } from "react-icons/im";
import { Extract, createExtract, deleteRecord, downloadFiles, expenses, receipt, searchInitial, searchNextMonth, searchPeriod, searchPeriodExpenses, searchPeriodReceipt, searchPreviousMonth, updateExtract } from '../hooks/useExtract';
import { useForm } from 'react-hook-form';
import { Payment, createPayment, searchPayments } from '../hooks/usePayment';
import { Link as LinkRouter } from "react-router-dom";

function Home() {

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
  const { isOpen: isOpenMenu, onOpen: onOpenMenu, onClose: onCloseMenu } = useDisclosure();
  const [credits, setCredits] = useState(false);
  const [debts, setDebts] = useState(false);
  const [selectedExtract, setSelectedExtract] = useState<Extract>();
  const [dateInitial, setDateInitial] = useState<String>();
  const [dateFinal, setDateFinal] = useState<String>();
  const [activeFilter, setActiveFilter] = useState<String>('gray.200'); 
  const [proofTransaction, setProofTransaction] = useState<File | null>();
  const [dateUpdate, setDateUpdate] = useState<Date>();
  const [categoryUpdate, setCategoryUpdate] = useState<string>('');
  const [titleUpdate, setTitleUpdate] = useState<string>('');
  const [valueUpdate, setValueUpdate] = useState<number>();

  const [payments, setPayments] = useState<Payment[]>();
  const [menuPayment, setMenuPayment] = useState<boolean>(false);

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

  async function update(){
    const obj = new Object({
      id:selectedExtract?.id,
      dateUpdate: dateUpdate ? dateFormated(dateUpdate) : dateFormated(selectedExtract?.date),
      categoryUpdate,
      titleUpdate,
      valueUpdate,
      proofTransactionUpdate: proofTransaction ? proofTransaction : selectedExtract?.proofTransaction
    });
    setActiveFilter('gray.200');
    setLoading(true);
    updateExtract(obj)
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
  console.log('Foiiii')
  setActiveFilter('gray.200');
  setLoading(true);
  createPayment(JSON.stringify(object))
  .then(() => {
    searchPaymentsInitial();
    successMessage(`Sucesso`, `Despesa cadastrada!`, 3000);
}).catch((e:any)=>errorMessage(`Erro`, `${e}`, 6000))
.finally(()=> setLoading(false));
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
        <Flex bg={'#4B0082'} color={'white'} h={'120px'} fontSize={28} display={'flex'} justifyContent={'space-between'} align={'center'}>
          <Box ml={'4%'}>
            <TiThMenu size={'10%'} onClick={onOpenMenu}/>
          </Box>
          <Text>Sistema Financeiro</Text>
          <Box>
            <RiMoneyDollarCircleLine size={'20%'}/>
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
      
    {!menuPayment ?
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
          onChange={(e:any)=>setProofTransaction(e.target.files?.item(0))}/>
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
      </Flex>:
      
      <Flex as={'form'} onSubmit={handleSubmit(createPayments)} display={'flex'} w={'1000px'}>
      <Card direction={'row'} >
        <CardBody>
          <Flex direction={'column'}>
            <Text>Nome</Text>
            <Input
            placeholder="Fulano..."
            size="md"
            type="text"
            required
            {...register("name")}
            />
          </Flex>
        </CardBody>

        <CardBody>
          <Flex direction={'column'}>
            <Text>Descrição</Text>
            <Input
            placeholder="Limpeza..."
            size="md"
            type="text"
            required
            {...register("description")}
            w={'100%'}
            />
          </Flex>
        </CardBody>

        <CardBody>
          <Text>Categoria</Text>
          <Select w={'150px'} {...register("category")}>
          <option value='Fixo'>Fixo</option>
          <option value='Porcentagem'>Porcentagem</option>
          </Select>
        </CardBody>

        <CardBody>
          <Text>Valor/salário</Text>
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

        <CardBody alignSelf={'end'}>
        <Button bg={'#4B0082'} type='submit' color={'white'} isLoading={loading} _hover={{backgroundColor:'#7600ca'}}>Adicionar</Button>
        </CardBody>
      </Card>
      </Flex>}

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
        {/* <Th>Categoria</Th> */}
        <Th isNumeric>Valor</Th>
        <Th isNumeric>Total</Th>
        <Th>Status</Th>
        <Th textAlign={'center'}>opções</Th>
      </Tr> }
    </Thead>

    <Tbody>
      {!menuPayment ? extractsInitial?.map((extract) => {
      return(
        <>
       <Tr key={extract.id}>
        <Td>{new Date(extract.date).toLocaleDateString('pt-BR')}</Td>
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
          icon={<FaFileDownload  size={'60%'} />}/>
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
      }):
      
      payments?.map((payment) => {
        return(
          <>
         <Tr key={payment.id}>
          <Td>{payment.name}</Td>
          <Td>{payment.description}</Td>
          {/* <Td>{payment.category.charAt(0).toUpperCase()+payment.category.substring(1)}</Td> */}
          <Td textAlign={'end'} fontWeight={'bold'}>{payment.category === 'Fixo' ? 'R$' : '%'}{payment.value.toFixed(2)}</Td>
          <Td textAlign={'end'} fontWeight={'bold'}>R${payment.category === 'Fixo' ? payment.value.toFixed(2) : (payment.value/100) * (Number(receiptTotal) - Number(expensesTotal))}</Td>
          <Td color={payment.status === 'N' ? 'red' : 'green'} fontWeight='bold'>{payment.status === 'N' ? 'Pendente' : 'Realizado'}</Td>
          <Td textAlign={'center'}>

          <IconButton
            isRound={true}
            variant='ghost'
            colorScheme='green'
            aria-label='Search database'
            icon={<MdMonetizationOn  size={'60%'} />} onClick={()=>{onOpen(); /*setSelectedExtract(payment)*/}}/>
  
          <IconButton
            isRound={true}
            variant='ghost'
            colorScheme='facebook'
            aria-label='Search database'
            icon={<AiTwotoneEdit size={'60%'} />} onClick={()=>{
                                                                // setSelectedExtract(payment);
                                                                // setProofTransaction(payment.proofTransaction);
                                                                onOpenUpdate()}}
            />
            <IconButton
            isRound={true}
            variant='ghost'
            colorScheme='red'
            aria-label='Search database'
            icon={<MdDelete size={'60%'} />} onClick={()=>{onOpen(); /*setSelectedExtract(payment)*/}}/>
        </Td>
       </Tr>
       </>
        )
        })
      }
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
                {...register("dateUpdate")}
                defaultValue={dateFormated(selectedExtract?.date)}
                onChange={(e:any)=>setDateUpdate(new Date(e.target.value))}
                />
              </CardBody>

              <CardBody>
              <Text>Categoria</Text>
              {selectedExtract?.category === 'Crédito' ?
              <Select {...register("categoryUpdate")} onChange={(e:any)=> setCategoryUpdate(e.target.value)}>
                <option value='Crédito'>Creditar</option>
                <option value='Débito'>Debitar</option>
              </Select>:
              <Select {...register("categoryUpdate")} onChange={(e:any)=> setCategoryUpdate(e.target.value)}>
              <option value='Débito'>Debitar</option>
              <option value='Crédito'>Creditar</option>
            </Select>}
              </CardBody>
              </Flex>

        <CardBody>
          <Text>Titulo</Text>
          <Input
           required {...register("titleUpdate")}
           defaultValue={selectedExtract?.title}
           onChange={(e:any)=>setTitleUpdate(e.target.value)} 
          //  onChange={(e)=> setExtractUpdate({...setExtractUpdate, title:e.target.value})}
           />
        </CardBody>

        <Flex>
        <CardBody>
          <Text>Valor</Text>
          <Flex>
          {/* <Text fontSize={'28px'}>R$</Text> */}
          <NumberInput defaultValue={selectedExtract?.value} min={0.1} max={99999999}>
            <NumberInputField required {...register("valueUpdate")} onChange={(e:any)=> setValueUpdate(Number(e.target.value))} />
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
            <Button bg={'#4B0082'} color={'white'} mr={3} _hover={{color:'white', backgroundColor:'#6801b3'}} onClick={()=>{setActiveFilter('red');onCloseSearch(); searchFilter()}}>
              Buscar
            </Button>
            <Button onClick={onCloseSearch}>Cancelar</Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Drawer
        isOpen={isOpenMenu}
        placement='left'
        onClose={onCloseMenu}
        // finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>

          <DrawerBody display={'flex'} flexDirection={'column'} gap={2}>
                  <Link textDecoration={'none'} onClick={()=> {searchInitialExtract(); setMenuPayment(false)}} >Início</Link>
                  <Link onClick={()=>{searchPaymentsInitial(); setMenuPayment(true)}} >Colaboradores</Link>
                  <Link onClick={()=>{searchPaymentsInitial(); setMenuPayment(true)}} >Acertos</Link>
                  <Link>Estatísticas</Link>
          </DrawerBody>

          <DrawerFooter>
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
