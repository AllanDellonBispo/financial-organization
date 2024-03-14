import { Button, Card, CardBody, Flex, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

type Props = {
    createPayments:(object: any) => Promise<void>;
    loading: boolean;
}

export const PaymentCreate = ({createPayments, loading}:Props) => {

    const {register, handleSubmit} = useForm();
    return(
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
      </Flex>
    );
}