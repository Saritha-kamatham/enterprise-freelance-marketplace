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
import com.enterprise.marketplace.dto.request.GoogleAuthRequest;
import com.enterprise.marketplace.dto.request.GoogleRoleSelectionRequest;
import com.enterprise.marketplace.dto.response.GoogleAuthResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

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

        String name = "";
        if (request.role() == Role.FREELANCER) {
            FreelancerProfile profile = new FreelancerProfile();
            profile.setUser(user);
            profile.setFullName(request.fullName() != null ? request.fullName() : "Freelancer");
            profile.setHourlyRate(BigDecimal.ZERO);
            profile.setRatingAvg(BigDecimal.ZERO);
            freelancerProfileRepository.save(profile);
            name = profile.getFullName();
        } else if (request.role() == Role.CLIENT) {
            ClientProfile profile = new ClientProfile();
            profile.setUser(user);
            profile.setCompanyName(request.companyName() != null ? request.companyName() : "Client Company");
            profile.setVerifiedStatus(false);
            clientProfileRepository.save(profile);
            name = profile.getCompanyName();
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole().name(), name);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String name = "";
        if (user.getRole() == Role.FREELANCER) {
            name = freelancerProfileRepository.findByUserId(user.getId())
                    .map(FreelancerProfile::getFullName)
                    .orElse("Freelancer");
        } else if (user.getRole() == Role.CLIENT) {
            name = clientProfileRepository.findByUserId(user.getId())
                    .map(ClientProfile::getCompanyName)
                    .orElse("Client Company");
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole().name(), name);
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

    @Override
    public GoogleAuthResponse authenticateGoogle(GoogleAuthRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    new GsonFactory()
            ).build();

            GoogleIdToken idToken = verifier.verify(request.credential());
            if (idToken == null) {
                throw new IllegalArgumentException("Invalid Google ID token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            java.util.Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());
                String userName = "";
                if (user.getRole() == Role.FREELANCER) {
                    userName = freelancerProfileRepository.findByUserId(user.getId())
                            .map(FreelancerProfile::getFullName)
                            .orElse(name != null ? name : "Freelancer");
                } else if (user.getRole() == Role.CLIENT) {
                    userName = clientProfileRepository.findByUserId(user.getId())
                            .map(ClientProfile::getCompanyName)
                            .orElse(name != null ? name : "Client Company");
                }
                AuthResponse authResponse = new AuthResponse(token, user.getId(), user.getEmail(), user.getRole().name(), userName);
                return new GoogleAuthResponse(false, null, email, name, authResponse);
            } else {
                String regToken = tokenProvider.generateToken(email, "ROLE_PENDING");
                return new GoogleAuthResponse(true, regToken, email, name, null);
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Google authentication failed: " + e.getMessage());
        }
    }

    @Override
    public AuthResponse completeGoogleRegistration(GoogleRoleSelectionRequest request) {
        if (!tokenProvider.validateToken(request.regToken())) {
            throw new IllegalArgumentException("Invalid or expired registration token");
        }

        String roleClaim = tokenProvider.getRoleFromToken(request.regToken());
        if (!"ROLE_PENDING".equals(roleClaim)) {
            throw new IllegalArgumentException("Invalid registration token type");
        }

        String email = tokenProvider.getEmailFromToken(request.regToken());
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        Role role = Role.valueOf(request.role());

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
        user.setRole(role);
        user = userRepository.save(user);

        String name = "";
        if (role == Role.FREELANCER) {
            FreelancerProfile profile = new FreelancerProfile();
            profile.setUser(user);
            profile.setFullName(request.fullName() != null && !request.fullName().isBlank() ? request.fullName() : "Freelancer");
            profile.setHourlyRate(BigDecimal.ZERO);
            profile.setRatingAvg(BigDecimal.ZERO);
            freelancerProfileRepository.save(profile);
            name = profile.getFullName();
        } else if (role == Role.CLIENT) {
            ClientProfile profile = new ClientProfile();
            profile.setUser(user);
            profile.setCompanyName(request.companyName() != null && !request.companyName().isBlank() ? request.companyName() : "Client Company");
            profile.setVerifiedStatus(false);
            clientProfileRepository.save(profile);
            name = profile.getCompanyName();
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole().name(), name);
    }
}
