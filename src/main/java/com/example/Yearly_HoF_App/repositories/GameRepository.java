package com.example.Yearly_HoF_App.repositories;

import com.example.Yearly_HoF_App.models.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findByReleaseYear(int releaseYear);
}
