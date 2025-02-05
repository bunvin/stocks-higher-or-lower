package demo.demo;

// import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
public class AppConfiguration {

    // @Bean
    // public ModelMapper modelMapper() {
    //     return new ModelMapper();
    // }; 
    
    //better not to use on JSON parse, better to use ObjectMapper 

    @Bean
    public ObjectMapper objectMapper(){
        return new ObjectMapper();
    }
}
