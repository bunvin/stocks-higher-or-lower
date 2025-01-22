package demo.demo;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class StoksDataController {
    @GetMapping("/stocks")
    public String getStocksData() throws IOException {
        String filePath = "python-scripts/stocks.json";
        // load the file from classpath
        ClassPathResource resource = new ClassPathResource(filePath);
        if (resource.exists()) {
            return new String(Files.readAllBytes(Paths.get(resource.getURI())));
        } else {
            return "File not found!";
        }
    }

}