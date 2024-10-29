package com.example.Yearly_HoF_App.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    private String developer;

    @NotBlank
    private String publisher;

    @NotNull
    private int releaseYear;

    @NotNull
    private LocalDate releaseDate;

    @Min(0)
    @Max(10)
    private double personalScore;

    @Column(columnDefinition = "TEXT")
    private String personalThoughts;


}
