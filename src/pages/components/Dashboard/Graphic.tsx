import { Box, Text } from "@chakra-ui/react";
import Chart from "react-apexcharts";

type State = {
    options: Object;
    series: Object[] | any;
}

type Props = {
    state: State;
}

export const Graphic = ({state}: Props) => {
    return(
        <Box>
        <Text>Renda mensal</Text>
        <div className="app">
          <div className="row">
            <div className="mixed-chart">
              <Chart
                options={state.options}
                series={state.series}
                type="area"
                width="1000"
                height={"300"}
              />
            </div>
          </div>
        </div>
        </Box>
    );
}