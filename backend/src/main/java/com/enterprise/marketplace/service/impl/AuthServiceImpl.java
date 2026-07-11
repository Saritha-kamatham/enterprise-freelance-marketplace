package com.enterprise.marketplace.service.impl;

import com.enterprise.marketplace.domain.entity.ClientProfile;
import com.enterprise.marketplace.domain.entity.FreelancerProfile;
import com.enterprise.marketplace.domain.entity.User;
import com.enterprise.marketplace.domain.enums.Role;
import com.enterprise.marketplace.dto.request.LoginRequest;
import com.enterprise.marketplace.dto.request.RegisterRequest;
import com.enterprise.marketplace.dto.response.AuthResponse;
import com.enterprise.marketplace.dto.response.UserProfileResponse;
import com.enterprise.marketplace.repository.ClientProfileRepository;
import com.enterprise.marketplace.repository.FreelancerProfileRepository;
import com.enterprise.marketplace.repository.UserRepository;
import com.enterprise.marketplace.security.JwtTokenProvider;
import com.enterprise.marketplace.service.AuthService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;
    private final ClientProfileRepository clientProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthServiceImpl(UserRepository userRepository,
                           FreelancerProfileRepository freelancerProfileRepository,
                           ClientProfileRepository clientProfileRepository,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.freelancerProfileRepository = freelancerProfileRepository;
        this.clientProfileRepository = clientProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already in use");
        }

        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(request.role());
        user = userRepository.save(user);

        if (request.role() == Role.FREELANCER) {
            FreelancerProfile profile = new FreelancerProfile();
            profile.setUser(user);
            profile.setFullName(request.fullName() != null ? request.fullName() : "Freelancer");
            profile.setHourlyRate(BigDecimal.ZERO);
            profile.setRatingAvg(BigDecimal.ZERO);
            freelancerProfileRepository.save(profile);
        } else if (request.role() == Role.CLIENT) {
            ClientProfile profile = new ClientProfile();
            profile.setUser(user);
            profile.setCompanyName(request.companyName() != null ? request.companyName() : "Client Company");
            profile.setVerifiedStatus(false);
            clientProfileRepository.save(profile);
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole().name());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole().name());
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getRole() == Role.FREELANCER) {
            FreelancerProfile profile = freelancerProfileRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Profile not found"));
            return new UserProfileResponse(
                    user.getId(), user.getEmail(), user.getRole().name(),
                    profile.getFullName(), profile.getPhone(), profile.getHeadline(), profile.getBio(),
                    profile.getSkills(), profile.getExperienceYears(), profile.getHourlyRate(),
                    profile.getRatingAvg(), profile.getCompletedProjectsCount(),
                    null, null, null, null, false
            );
        } else {
            ClientProfile profile = clientProfileRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Profile not found"));
            return new UserProfileResponse(
                    user.getId(), user.getEmail(), user.getRole().name(),
                    null, null, null, null, null, 0, null, null, 0,
                    profile.getCompanyName(), profile.getContactPerson(), profile.getLocation(),
                    profile.getWebsite(), profile.isVerifiedStatus()
            );
        }
    }

    @Override
    public UserProfileResponse updateFreelancerProfile(Long id, UserProfileResponse request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        FreelancerProfile profile = freelancerProfileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found"));

        if (!profile.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new SecurityException("Unauthorized profile update request");
        }

        profile.setFullName(request.fullName());
        profile.setPhone(request.phone());
        profile.setHeadline(request.headline());
        profile.setBio(request.bio());
        profile.setSkills(request.skills());
        profile.setExperienceYears(request.experienceYears());
        profile.setHourlyRate(request.hourlyRate());

        freelancerProfileRepository.save(profile);
        return getProfile(email);
    }

    @Override
    public UserProfileResponse updateClientProfile(Long id, UserProfileResponse request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        ClientProfile profile = clientProfileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found"));

        if (!profile.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new SecurityException("Unauthorized profile update request");
        }

        profile.setCompanyName(request.companyName());
        profile.setContactPerson(request.contactPerson());
        profile.setPhone(request.phone());
        profile.setLocation(request.location());
        profile.setWebsite(request.website());

        clientProfileRepository.save(profile);
        return getProfile(email);
    }
}
