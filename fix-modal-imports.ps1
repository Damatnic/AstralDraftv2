# PowerShell script to fix Modal imports
$files = @(
"components\team\PlaceClaimModal.tsx",
"components\team\ProposeTradeModal.tsx", 
"components\team\ManageTradeBlockModal.tsx",
"components\player\PlayerDetailModal.tsx",
"components\player\EnhancedPlayerDetailModal.tsx",
"components\modals\TradeStoryModal.tsx",
"components\modals\TradeScenarioModal.tsx",
"components\modals\ShareTeamCardModal.tsx",
"components\modals\ProposeTradeModal.tsx",
"components\modals\ProposeSideBetModal.tsx",
"components\modals\ChecklistReportModal.tsx",
"components\modals\AssignAwardsModal.tsx",
"components\matchup\RivalryReportModal.tsx",
"components\dashboard\CustomizeDashboardModal.tsx",
"components\core\EditProfileModal.tsx",
"components\core\MockDraftModal.tsx",
"components\core\PreferencesModal.tsx",
"components\commissioner\InviteMemberModal.tsx",
"components\commissioner\PostAnnouncementModal.tsx",
"components\commissioner\ManageTradesModal.tsx",
"components\commissioner\CreatePollModal.tsx",
"components\commissioner\AddPlayerModal.tsx",
"components\analytics\PlayerCompareTool.tsx"
)

foreach ($file in $files) {
    $fullPath = "c:\Users\damat\_REPOS\AD\$file"
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        # Fix import statement
        $content = $content -replace "import Modal from '../ui/Modal';", "import { Modal } from '../ui/Modal';"
        $content = $content -replace "import Modal from '../../ui/Modal';", "import { Modal } from '../../ui/Modal';"
        # Fix Modal usage
        $content = $content -replace "<Modal onClose=", "<Modal isOpen={true} onClose="
        Set-Content $fullPath $content -NoNewline
        Write-Host "Fixed: $file"
    } else {
        Write-Host "Not found: $file"
    }
}
