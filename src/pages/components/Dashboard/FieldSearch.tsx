import { Button, Card, CardBody, Flex, Input, Text } from "@chakra-ui/react";

type Props = {
    onChangeDateInitial:(e:any)=> void;
    onChangeDateFinal:(e:any)=> void;
    dateInitial: String;
    dateFinal: String;
    searchPeriodOfGraphic:()=> Promise<void | undefined>;
}

export const FieldSearch = ({onChangeDateInitial, onChangeDateFinal, dateInitial, dateFinal, searchPeriodOfGraphic}: Props) => {
    return(
        <Card direction={'row'} w={'1000px'}>
        <CardBody>
        <Flex alignSelf={'center'}>
          <Text w={'50%'}>Data início</Text>
          <Input
          placeholder="Selecione uma data"
          size="md"
          type="date"
          defaultValue={new Date().toISOString().substring(0,10)}
          onChange={onChangeDateInitial}
          />
        </Flex>
      </CardBody>

      <CardBody>
        <Flex>
          <Text w={'50%'} alignSelf={'center'}>Data fim</Text>
          <Input
          placeholder="Selecione uma data"
          size="md"
          type="date"
          defaultValue={new Date().toISOString().substring(0,10)}
          onChange={onChangeDateFinal}
          />
        </Flex>
      </CardBody>

      <CardBody display={'flex'} alignItems={'center'}>
        <Flex direction={'column'}>
          <Button
          bg='#4B0082'
          color={'white'}
          _hover={{backgroundColor:'#7600ca'}}
          isDisabled={dateInitial < dateFinal ? false : true}
          onClick={searchPeriodOfGraphic}>Buscar registros</Button>
        </Flex>
      </CardBody>
     </Card>
    );
}