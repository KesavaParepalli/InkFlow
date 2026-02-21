package com.blogapp.blogapp.services.impl;


import com.blogapp.blogapp.dtos.CommentDto;
import com.blogapp.blogapp.entities.Comment;
import com.blogapp.blogapp.entities.User;
import com.blogapp.blogapp.repositories.CommentRepository;
import com.blogapp.blogapp.repositories.PostRepository;
import com.blogapp.blogapp.repositories.UserRepository;
import com.blogapp.blogapp.services.CommentService;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository repo;
    private final PostRepository postRepo;
    private final UserRepository userRepo;

    public CommentServiceImpl(CommentRepository repo, PostRepository postRepo, UserRepository userRepo) {
        this.repo = repo;
        this.postRepo = postRepo;
        this.userRepo = userRepo;
    }

    private String getLoggedInEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        return principal.toString();
    }

    public CommentDto createComment(CommentDto dto) {
        Comment c = new Comment();
        c.setContent(dto.getContent());
        c.setPost(postRepo.findById(dto.getPostId()).orElse(null));

        // Attach the authenticated user to the comment
        String email = getLoggedInEmail();
        User user = userRepo.findByEmail(email);
        if (user != null) {
            c.setUser(user);
        }

        Comment saved = repo.save(c);
        dto.setId(saved.getId());
        if (user != null) {
            dto.setUserId(user.getId());
            dto.setUserName(user.getName());
        }
        return dto;
    }

    public List<CommentDto> getCommentsByPost(Long postId) {
        return repo.findByPostId(postId).stream().map(c -> {
            CommentDto cd = new CommentDto();
            cd.setId(c.getId());
            cd.setContent(c.getContent());
            cd.setPostId(postId);
            // Map user info from the Comment entity
            if (c.getUser() != null) {
                cd.setUserId(c.getUser().getId());
                cd.setUserName(c.getUser().getName());
            }
            return cd;
        }).collect(Collectors.toList());
    }

    public void deleteComment(Long id) {
        repo.deleteById(id);
    }
}
