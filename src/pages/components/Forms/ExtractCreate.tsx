import { Button, Card, CardBody, Flex, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Text } from "@chakra-ui/react";
import { FieldValues, SubmitHandler, UseFormHandleSubmit, UseFormRegister, useForm } from "react-hook-form";
import { MdFileDownloadDone, MdOutlineClose } from "react-icons/md";

type Props = {
    create:(object: any) => Promise<void>;
    proofTransaction: File | null | undefined;
    setProofTransaction: React.Dispatch<React.SetStateAction<File | null | undefined>>;
    loading: boolean;
}

export const ExtractCreate = (
    {create,
    proofTransaction,
    setProofTransaction,
    loading}:Props) =>{

    const {register, handleSubmit} = useForm();

    return(
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

      </Flex>
    );
}