package demo.demo.beans.stock;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @JsonProperty("Company")
    private String company;

    @JsonProperty("Symbol")
    private String symbol;

    @JsonProperty("Price")
    private String price;

    @Column(name = "`change`")
    @JsonProperty("Change")
    private String change;

    @JsonProperty("Volume")
    private String volume;

    @JsonProperty("URL")
    private String url;
    @JsonProperty("Description")
    private String description;

    @JsonProperty("Last_Updated")
    private String lastUpdated;

}
